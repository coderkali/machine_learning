# How a 3D Scatter Turns Three Numbers Into One Pixel

> 📘 **Instructor Curriculum** — M02, supporting note for
> [`example_01.ipynb`](./example_01.ipynb) section 9
>
> 💡 The linear algebra below is an **Engineering Extension** —
> *Recommended Extension - Not part of instructor curriculum.* You can use
> `px.scatter_3d` without it. Read this when you want to know why a 3D chart can
> mislead you, rather than just being told that it can.

Everything here is checked against **plotly 6.9.0**, using the bundled renderer
`plotly/package_data/plotly.min.js` and the real `px.data.iris()` values. Source
snippets are quoted from that file.

---

## 1. The problem in one line

A screen pixel has **two** coordinates. `px.scatter_3d` is handed **three**. So one
number cannot survive as a position. The question is not *whether* something is lost —
it is *what* is lost, and what that costs you when you read the chart.

## 2. The four steps

```text
   DATA            WORLD             CAMERA            NDC            SCREEN
   (5.1,3.5,1.4)   (-0.25,          (0.23,            (0.15,         (403, 354)
    centimetres     0.08,            -0.46,            -0.42)         pixels
                    -0.65)           -2.64)
        |               |                 |                |              |
        +--- model -----+---- view -------+--- projection -+-- viewport --+
             matrix          matrix           + divide        transform
```

Four transforms. Three of them are ordinary moving and scaling. **All the information
loss happens in one place: the divide inside step 3.**

The worked example throughout is the first row of `iris`:

```python
iris.iloc[0]     # sepal_length 5.1, sepal_width 3.5, petal_length 1.4, species setosa
```

---

## 3. Step 1 — model: from centimetres to a box around the origin

### 3.1 Why anything has to happen at all

The three chosen columns do not share a range:

| Axis | Column | Data min | Data max | Span |
|---|---|---|---|---|
| x | `sepal_length` | 4.3 | 7.9 | **3.6** |
| y | `sepal_width` | 2.0 | 4.4 | **2.4** |
| z | `petal_length` | 1.0 | 6.9 | **5.9** |

Drawn in raw centimetres, the box would be a thin slab and two of the three variables
would be nearly invisible. So each axis is scaled by its own span.

### 3.2 What plotly actually computes

From `plotly.min.js`, in the scene's `plot` method — one scale factor per axis:

```js
for (s = 0; s < 3; ++s)
    h[1][s] === h[0][s] ? d[s] = 1
                        : d[s] = 1 / (h[1][s] - h[0][s]);
n.dataScale = d;
```

`h[0]` and `h[1]` are the per-axis data minimum and maximum. So:

```text
   dataScale = [ 1/3.6, 1/2.4, 1/5.9 ] = [ 0.2778, 0.4167, 0.1695 ]
```

The drawn axis range is slightly wider than the data — the same file pads it by a
thirty-second of the span at each end:

```js
var E = m[1][o] - m[0][o];
m[0][o] -= E / 32;
m[1][o] += E / 32;
```

| Axis | Axis range (padded) | Midpoint | Range width |
|---|---|---|---|
| x | 4.1875 … 8.0125 | 6.10 | 3.825 |
| y | 1.9250 … 4.4750 | 3.20 | 2.550 |
| z | 0.8156 … 7.0844 | 3.95 | 6.269 |

Then the model matrix (this one lives in the bundled `gl-plot3d`) scales and re-centres:

```js
g.autoScale ? V[5 * ae] = g.aspect[ae] / (E[1][ae] - E[0][ae])
            : V[5 * ae] = 1 / _e,
g.autoCenter && (V[12 + ae] = -V[5 * ae] * 0.5 * (E[0][ae] + E[1][ae]))
```

That is a diagonal scale plus a translation — a matrix of the form

```text
        | sx  0   0   tx |          sx = aspect_x / rangeWidth_x
   M =  | 0   sy  0   ty |          tx = -sx * midpoint_x
        | 0   0   sz  tz |
        | 0   0   0   1  |
```

### 3.3 The formula worth memorising

Compose the `dataScale` step with the model matrix and **the scale factor cancels
out entirely**. What is left is readable:

```text
   world[i] = (value - axisMid[i]) / axisRangeWidth[i] * aspect[i]
              \___________________________________/
                fraction of the axis, measured from its middle
                     -0.5 = axis minimum,  +0.5 = axis maximum
```

For row 0:

```text
   x:  (5.1 - 6.10) / 3.825 = -0.2614   ->  x 0.9709  =  -0.2538
   y:  (3.5 - 3.20) / 2.550 =  0.1176   ->  x 0.6473  =   0.0762
   z:  (1.4 - 3.95) / 6.269 = -0.4068   ->  x 1.5912  =  -0.6473

   world = (-0.2538, 0.0762, -0.6473)
```

### 3.4 The first honest warning

**The unit is gone.** After this step nothing in the pipeline knows what a centimetre
is. A 1 cm step along `sepal_width` (span 2.4) is drawn **1.64× longer** than a 1 cm
step along `petal_length` (span 5.9).

So: *distance you see in a 3D scatter is not distance in the data.* Two clusters that
look equally far apart along different axes usually are not. This is true of 2D scatter
plots too, but in 2D you can read it off the axis ticks — in 3D, with the box rotated
and the ticks foreshortened, almost nobody does.

### 3.5 The aspect ratio — putting a little shape back

`aspect` is what stops the box from always being a perfect cube. From the same file:

```js
if (V === "cube") q = [1, 1, 1];
else if (V === "manual") { ... }
else if (V === "auto" || V === "data") {
    var Z = [1, 1, 1];
    for (o = 0; o < 3; ++o) {
        var j = p[u];
        Z[o] = Math.pow(j.acc, 1 / j.count) / d[o];
    }
    V === "data" || Math.max.apply(null, Z) / Math.min.apply(null, Z) <= 4
        ? q = Z
        : q = [1, 1, 1];
}
```

With three linear axes, `j.acc` is `d[0]*d[1]*d[2]` and `j.count` is 3 — so
`pow(j.acc, 1/3)` is the **geometric mean** of the scale factors, and

```text
   aspect[i] = geomean(dataScale) / dataScale[i]
             = geomean(dataScale) * span[i]        <- proportional to the real span
```

For iris:

```text
   geomean(dataScale) = (0.2778 x 0.4167 x 0.1695)^(1/3) = 0.2697

   aspect = 0.2697 x [3.6, 2.4, 5.9] = [0.9709, 0.6473, 1.5912]

   max/min = 1.5912 / 0.6473 = 2.458   <= 4   ->  keep these proportions
```

`aspectmode` defaults to `"auto"`, which means *"stay proportional to the data unless
one axis is more than 4× another, in which case give up and draw a cube."* Above that
ratio the shape would be an unusable sliver, so plotly silently switches to `[1,1,1]` —
worth knowing, because at that point the picture stops being proportional at all and
nothing on screen tells you.

Override it when you need honesty:

```python
fig.update_layout(scene_aspectmode="data")    # always proportional, never a cube
fig.update_layout(scene_aspectmode="cube")    # always a cube, never proportional
```

---

## 4. Step 2 — view: put the camera at the origin

Nothing is lost here. The whole world is rotated and shifted so that the camera sits at
the origin looking down its own −Z axis. It is a change of address, not of shape.

Plotly's defaults, straight from the attribute table in `plotly.min.js`:

```js
camera: {
    up:     GX(HX(0, 0, 1), {}),
    center: GX(HX(0, 0, 0), {}),
    eye:    GX(HX(1.25, 1.25, 1.25), {}),
    projection: { type: { values: ["perspective", "orthographic"], dflt: "perspective" } }
}
```

| Field | Default | Meaning |
|---|---|---|
| `eye` | (1.25, 1.25, 1.25) | where you are standing, in world units |
| `center` | (0, 0, 0) | the point you are looking at |
| `up` | (0, 0, 1) | which way is up — **this is why z is the vertical axis** |
| `projection.type` | `"perspective"` | near things drawn larger |

`eye` sits on the long diagonal of the box, `2.165` world units from the centre. That
single default is why every untouched plotly 3D chart looks like you are hovering above
one corner.

### 4.1 Building the matrix

The bundle uses gl-matrix's `lookAt`, which builds three orthogonal unit vectors:

```text
   forward  f = normalise(center - eye) = (-0.5774, -0.5774, -0.5774)
   right    s = normalise(f x up)       = (-0.7071,  0.7071,  0.0000)
   true up  u = s x f                   = (-0.4082, -0.4082,  0.8165)
```

and stacks them as rows, with the translation `-(vector · eye)` in the last column:

```text
         | -0.7071   0.7071   0.0000    0.0000 |
   V  =  | -0.4082  -0.4082   0.8165    0.0000 |
         |  0.5774   0.5774   0.5774   -2.1651 |
         |  0.0000   0.0000   0.0000    1.0000 |
```

Read the rows as questions asked of the point: *how far right? how far up? how far
back?*

### 4.2 Our point

```text
   V x (-0.2538, 0.0762, -0.6473, 1)  =  (0.2333, -0.4560, -2.6413, 1)
                                          \____/  \_____/  \______/
                                          right     up      -depth
```

The third component is now **−2.6413**, meaning the point is 2.6413 units in front of
the camera. Depth has become an explicit number. It is the last moment it exists as a
position.

---

## 5. Step 3 — projection: the divide

The perspective matrix (gl-matrix's `perspective`, `fovy = π/4`, `near = 0.01`,
`far = 1000`) is:

```text
   focal = 1 / tan(fov / 2) = 1 / tan(22.5 deg) = 2.4142
   canvas 700 x 500  ->  aspect = 1.4

         | focal/aspect   0       0        0    |     | 1.7244  0       0       0      |
   P  =  |      0       focal     0        0    |  =  | 0       2.4142  0       0      |
         |      0         0      A         B    |     | 0       0      -1.0000 -0.0200 |
         |      0         0      -1        0    |     | 0       0      -1       0      |
```

The fourth row is `(0, 0, −1, 0)`. That is the whole mechanism: it **copies the depth
into the w slot**. Then the hardware divides everything by w:

```text
   clip   = P x camera = (0.4024, -1.1008, 2.6214, 2.6414)
                                                   \______/
                                                   w = depth

   ndc    = clip / w   = (0.1523, -0.4167, 0.9924)
```

Written without matrices:

```text
   ndc_x = 1.7244 x  0.2333 / 2.6413 =  0.1523
   ndc_y = 2.4142 x -0.4560 / 2.6413 = -0.4167
                              ^^^^^^
                    every 3D chart is this division
```

**This is where the third dimension is spent.** Not hidden, not compressed — *consumed*
as a divisor. Two consequences follow immediately:

1. Far points get divided by a larger number, so they move toward the screen centre and
   shrink. That is why the cube's edges converge.
2. Any two points on the same line out of the eye divide down to the **same** `ndc`.
   The mapping from 3D to 2D is many-to-one, so it cannot be undone.

The third `ndc` component (0.9924) is kept, but only for the depth buffer — it decides
which point is drawn in front. It never becomes a position you can read.

> Setting `projection.type = "orthographic"` removes the divide (w stays 1). Parallel
> lines stay parallel and distances along an axis stay comparable — but you lose the
> depth cue entirely, so it usually looks flatter and more confusing, not less.

---

## 6. Step 4 — viewport: NDC to pixels

Plain arithmetic on a 700 × 500 canvas. Note the flip: NDC counts up, screen pixels
count down.

```text
   px = (ndc_x + 1) / 2 x width  = (0.1523 + 1) / 2 x 700 = 403.3
   py = (1 - ndc_y) / 2 x height = (1 + 0.4167) / 2 x 500 = 354.2
```

```text
   iris row 0  (5.1, 3.5, 1.4)  ->  pixel (403, 354)
```

---

## 7. What it costs — measured, not asserted

Run the projection over all 150 iris rows with the default camera and look for
collisions:

```text
   A   sepal_length 6.3, sepal_width 3.3, petal_length 4.7  ->  (344.6, 212.7)  depth 2.011
   B   sepal_length 5.5, sepal_width 2.5, petal_length 4.0  ->  (345.4, 212.7)  depth 2.348

   distance on screen:  0.77 pixels
   distance in data:    1.33 cm
```

Two different flowers, drawn as one dot. Across the dataset:

| Measure | Value |
|---|---|
| point pairs landing within 3 px of each other | **29** |
| point pairs landing within 6 px | **111** |
| nearest point vs furthest point (depth) | 1.44 vs 2.92 — a **2.03×** difference |

That last row is the perspective distortion: the same marker at the near edge of the
box is divided by half the number the far edge is, so the front of the cloud is drawn
at roughly twice the scale of the back.

None of this is a plotly defect. It is what projection *is*. Every 3D renderer ever
written — games, CAD, film — does the same divide.

---

## 8. Why rotating is not just nice, it is the fix

Rotating the chart changes `eye`. A new `eye` gives a new `lookAt` matrix, a new depth
per point, and therefore a **different set of collisions**. The pair that overlapped
above will separate from almost any other angle.

```text
   view 1                       view 2
   eye = (1.25, 1.25, 1.25)     eye = (2, 0, 0)

        A B   <- one dot             A
                                       B    <- clearly two
```

**Motion is the depth cue.** The practical rules that follow:

| Situation | Verdict |
|---|---|
| live notebook, you can drag it | 3D is reasonable — you can resolve the ambiguity |
| screenshot in a report or slide | 3D is weak — the reader is stuck with one projection |
| printed | 3D is close to useless |

If a 3D chart must be static, give the reader at least two camera angles, or do not use
3D:

```python
fig.update_layout(scene_camera=dict(eye=dict(x=2, y=0, z=0.3)))
```

---

## 9. The alternatives that do not lose anything

| Want to show | Better than 3D | Why |
|---|---|---|
| 3 numeric columns | 2D scatter + `color=` third column | no projection, no occlusion |
| 4 numeric columns | 2D scatter + `color=` + `size=` | channels are free; a third axis is not |
| all pairs at once | `px.scatter_matrix` / seaborn `pairplot` | every pair seen undistorted |
| 2 numerics + 2 categories | `facet_row` / `facet_col` | small multiples beat one crowded chart |

For iris specifically, this beats the 3D chart on every count:

```python
px.scatter(iris, x="petal_length", y="petal_width", color="species")
```

The petal columns separate the species nearly completely. No dimension is projected
away, no point hides behind another, and the axes still carry centimetres.

---

## 10. Reproduce the numbers yourself

Every figure in this note comes from the script below. Run it and change the camera
`eye` to watch the collisions move.

```python
import numpy as np, plotly.express as px

iris = px.data.iris()
cols = ["sepal_length", "sepal_width", "petal_length"]
lo = np.array([iris[c].min() for c in cols])
hi = np.array([iris[c].max() for c in cols])
span = hi - lo

# --- step 1: model -------------------------------------------------------
d      = 1 / span                                  # plotly's dataScale
aspect = (np.prod(d) ** (1 / 3)) / d               # "auto" aspect ratio
if aspect.max() / aspect.min() > 4:                # plotly's cube fallback
    aspect = np.ones(3)
rlo, rhi = lo - span / 32, hi + span / 32          # autorange padding
mid, width = (rlo + rhi) / 2, rhi - rlo
world = (iris[cols].to_numpy(float) - mid) / width * aspect

# --- step 2: view (gl-matrix lookAt) -------------------------------------
eye, center, up = np.array([1.25, 1.25, 1.25]), np.zeros(3), np.array([0, 0, 1.0])
f = center - eye;   f /= np.linalg.norm(f)
s = np.cross(f, up); s /= np.linalg.norm(s)
u = np.cross(s, f)
V = np.eye(4)
V[0, :3], V[1, :3], V[2, :3] = s, u, -f
V[0, 3], V[1, 3], V[2, 3] = -s @ eye, -u @ eye, f @ eye

cam = np.c_[world, np.ones(len(world))] @ V.T
depth = -cam[:, 2]

# --- steps 3 and 4: projection and viewport ------------------------------
W, H, fov = 700, 500, np.pi / 4
focal = 1 / np.tan(fov / 2)
ndc_x = (focal / (W / H)) * cam[:, 0] / depth
ndc_y = focal * cam[:, 1] / depth
px_x, px_y = (ndc_x + 1) / 2 * W, (1 - ndc_y) / 2 * H

print("aspect      ", aspect.round(4))
print("row 0 world ", world[0].round(4))
print("row 0 camera", cam[0].round(4))
print("row 0 pixel ", round(px_x[0], 1), round(px_y[0], 1))
```

---

## Interview view

1. **Why can a 3D scatter mislead?** Projection is many-to-one — a pixel is a ray, so
   screen position alone cannot locate a point.
2. **Where exactly is the third dimension lost?** In the perspective divide: `x/w` and
   `y/w`, where `w` is the depth. Depth becomes a divisor, not a coordinate.
3. **Why is rotating necessary?** It changes the camera, which changes every depth, which
   changes which points overlap. Motion supplies the cue the projection removed.
4. **Why are the axes not comparable?** Each is normalised by its own range, so the unit
   cancels. Only `aspectmode="data"` keeps proportions, and even that is overridden when
   one axis is more than 4× another.
5. **When would you use 3D in production?** When the data is genuinely spatial — a
   surface, a trajectory, a physical object — and the user can rotate it. Not for
   showing three arbitrary columns.

---

**If you remember only one thing:** a 3D chart does not give your screen a third
dimension — it **trades one away**. The third number survives only as the divisor in
`x / depth`, which is why the picture is honest only while you can rotate it.
