// 'use client';
// // import Contact from "@/components/ContactForm";
// import { useState, ChangeEvent, FormEvent } from 'react';

// type FormData = {
//   name: string;                                
//   email: string;
//   message: string;
// };

// const ContactForm = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     message: '',
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     // TODO: Send formData to backend or API service like EmailJS
//     console.log(formData);
//     setSubmitted(true);
//     setFormData({ name: '', email: '', message: '' });
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
//       <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
//       {submitted && <p className="text-green-600 mb-4">Message sent successfully!</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Your Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="w-full border p-3 rounded"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Your Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="w-full border p-3 rounded"
//         />
//         <textarea
//           name="message"
//           placeholder="Your Message"
//           rows={5}
//           value={formData.message}
//           onChange={handleChange}
//           required
//           className="w-full border p-3 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
//         >
//           Send Message
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ContactForm;

