const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !email.trim()) {
    alert("Both name and email are required.");
    return;
  }

  try {
    await addDoc(collection(db, "leads"), {
      name: name.trim(),
      email: email.trim()
    });

    setName("");
    setEmail("");
    onSubmitComplete(); // trigger refresh
  } catch (error) {
    console.error("Failed to add lead:", error);
  }
};
