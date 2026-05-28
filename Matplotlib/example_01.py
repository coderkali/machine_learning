import numpy as np
import pandas as pd

import matplotlib.pyplot as plt
import matplotlib

print(matplotlib.__version__)


print("\n--------Simple Line Plot-------\n")
x = np.linspace(0,10,50)
y = np.sin(x)

# print(x," :; ",y)

print(x[:5])
print(y[:5])

plt.plot(x,y)
plt.title("Simple Line Plot")
plt.xlabel("x- Axis")
plt.ylabel("y=Sin(x)")
plt.show()



