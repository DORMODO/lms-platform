import pandas as pd
import ast

def load_data(path="data/coursera_course_2024.csv"):
    df = pd.read_csv(path)
    df = df.fillna("")

    documents = []  # للـ FAISS embedding
    metadata = []   # للـ results اللي بترجعها للـ user

    for _, row in df.iterrows():
        title = row.get("title", "")
        description = row.get("Description", "")
        level = row.get("Level", "")
        org = row.get("Organization", "")

        skills = row.get("Skills", "")
        try:
            skills = " ".join(ast.literal_eval(skills))
        except:
            skills = str(skills)

        text = f"Course: {title}. Description: {description}. Skills: {skills}. Level: {level}. Organization: {org}."
        documents.append(text)

        metadata.append({
            "title": title,
            "description": description,
            "level": level,
            "organization": org,
            "skills": skills,
        })

    return documents, metadata

#test code 
if __name__ == "__main__":
    documents, metadata = load_data()
    print(f"Loaded {len(documents)} documents.")
    print("-" * 50)
    print("Sample document:", documents[0])
    print("-" * 50)
    print("Sample metadata:", metadata[0])