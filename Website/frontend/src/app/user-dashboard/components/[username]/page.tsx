import Certificate from "../Certificate";

export default function CertificatePage({ params }: { params: { username: string } }) {
  const userData = {
    learnerName: decodeURIComponent(params.username),
    courseName: "Soap Making Masterclass",
    finalScore: 92,
    issuedDate: "2025-07-18",
  };

  return <Certificate {...userData} />;
}