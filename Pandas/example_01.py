import pandas as pd

print("**Series Of Data**\n")

s = pd.Series([10,20,30,40],name= "marks")

print(type(s))
print("\n----------------\n")
print(s)
print("\n----------------\n")
print(s[0])
print("\n----------------\n")
print(s.mean())

print("**Data Frame(2D Data)**\n")

data = {
    "Name": ["Kali","Meeta", "krithvik"],
    "Age": [34,33,2],
    "Score": [85,87,98]
}

data_frame = pd.DataFrame(data)

print("\n----------------\n")

print(data_frame)

print("\n----------------\n")

print(data_frame.head())

print("\n----------------\n")

print(data_frame.tail())


print("\nSaving  Data Fraome to CSV \n")

#data_frame.to_csv("data_sample.csv")

print("\nRead Data From CSV Files \n")


daiabetes_csv = pd.read_csv("/Users/kaliprasad/Documents/MACHINE_LEARNING/Pandas/diabetes.csv")
print("\n----------------\n")
print(daiabetes_csv)
print("\n--------Shapes--------\n")
print(daiabetes_csv.shape)
print("\n-------Colmns---------\n")
print(daiabetes_csv.columns)
print("\n-------Head---------\n")
print(daiabetes_csv.head())
print("\n-------Tail---------\n")
print(daiabetes_csv.tail())
print("\n-------Info---------\n")
print(daiabetes_csv.info())

print("\n-------Selecting the data---------\n")
#Single Columns 
print(daiabetes_csv["Glucose"])
#Multiple Columns 
print(daiabetes_csv[["Glucose","BloodPressure"]])
print("\n-------#row selections ---------\n")
print(daiabetes_csv.iloc[1])
print("\n-------#row selections with o value ---------\n")
print(daiabetes_csv.iloc[0])


print("\n-------Sample Data ---------\n")

data = {
    "Name ": ["kali","Meeta","Rishi"],
    "Score": [100,200,300]
}

sample_df = pd.DataFrame(data, index = ["a","b","c"])

print(sample_df.head())
print(sample_df.tail())



