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
    "Score": [78,98,89]
}

sample_df = pd.DataFrame(data, index = ["a","b","c"])

print(sample_df.head())
print(sample_df.tail())

print("\n----------------\n")
print(sample_df.iloc[1])
print("\n----------------\n")
print(sample_df.loc["c"])

print("\n--------HighScore--------\n")
high_score = sample_df[sample_df["Score"] > 85]
print(high_score)

print("\n--------LowScore--------\n")
low_score = sample_df[sample_df["Score"] < 85]
print(low_score)

print("\n--------Adding a new Column--------\n")
sample_df["Passed"] = sample_df["Score"] > 70
print(sample_df)
print("\n--------Adding a new Column--------\n")
sample_df["Score_Percentage"] = sample_df["Score"]/100 *100
print(sample_df)
print("\n--------Adding a new Column--------\n")
sample_df["City"] = ["New York", "Chicgo", "Columbus"]
print(sample_df)

print("\n--------Descriptive Statistsics--------\n")
print("Avergae Score ::",sample_df["Score"].mean())
print("Max Score ::",sample_df["Score"].max())
print("Min",sample_df["Score"].min())

print("\n--------Describe-------\n")

print(sample_df.describe())

print("\n--------Handling Missing Data-------\n")

df2 = pd.DataFrame({
    "Name": ["kali","Meeta","Rishi",None],
    "Age": [35,None,3,10],
    "Score": [85,91,None,88]
})

print(df2.head())

print("\n--------Drop The name Who is having a  NONE-------\n")

df2.dropna(subset=["Name"],inplace=True)

print(df2.head())

print("\n--------Replace with average value in NONE-------\n")

df2["Age"] = df2["Age"].fillna(df2["Age"].mean())
df2["Score"] = df2["Score"].fillna(df2["Score"].mean())

print(df2.head())

