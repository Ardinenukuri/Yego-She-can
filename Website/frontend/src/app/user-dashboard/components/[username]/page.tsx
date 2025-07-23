import Certificate from "../Certificate"; // This path is correct for the required structure

export default function CertificatePage({ 
  params,
  searchParams,
}: { 
  params: { username: string };
  searchParams: { courseName?: string; issuedDate?: string; finalScore?: string };
}) {

  const userData = {
    learnerName: decodeURIComponent(params.username),
    courseName: searchParams.courseName || "Course Name Not Found",
    issuedDate: searchParams.issuedDate 
      ? new Date(searchParams.issuedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString(),
    finalScore: searchParams.finalScore ? parseInt(searchParams.finalScore, 10) : 0,
  };

  return <Certificate {...userData} />;
}