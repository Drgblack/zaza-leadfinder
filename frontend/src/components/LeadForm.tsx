import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

interface LeadFormProps {
  onSubmitComplete: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmitComplete }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name?.trim() || !email?.trim()) {
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

  return (
    <form onSubmit={handleSubmit}>
      {/* your form inputs here */}
    </form>
  );
};

export default LeadForm;
