import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

plt.figure(figsize=(8,5))
plt.plot([1,2,3],[4,5,6])
plt.show()

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot([1,2,3], [4,5,6])
plt.show()