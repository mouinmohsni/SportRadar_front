import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubscribe = () => {
    if (email.trim()) {
      setSuccessMessage("Merci pour votre abonnement !");
      setErrorMessage("");
      setEmail("");
    } else {
      setErrorMessage("Veuillez entrer un email valide.");
      setSuccessMessage("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubscribe();
  };

  return (
    <section className="py-16 bg-[#C7C5C5]  text-center">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">
          Newsletter SportRadar
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
        >
          <input
            type="email"
            required
            placeholder="Votre email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="px-4 py-3 w-full sm:w-72 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-600 text-[#0A1128] font-bold px-6 py-3 rounded-lg  hover:bg-orange-700 transition duration-200"
          >
            S'abonner
          </button>
        </form>

        {successMessage && (
          <p className="mt-4 text-[#0a1128] font-medium">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-600 font-medium">{errorMessage}</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
