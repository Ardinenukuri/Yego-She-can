import Certificate from "../../../../components/Certificate";


interface CertificatePageProps {
  params: {
    username: string;
  };
  searchParams: {
    courseName?: string;
    issuedDate?: string;
    finalScore?: string; // This prop is passed but not used by Certificate.tsx
  };
}

export default function CertificatePage({ params, searchParams }: CertificatePageProps) {

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
    // The Certificate component doesn't use finalScore, so we don't need to pass it.
    // finalScore: searchParams.finalScore ? parseInt(searchParams.finalScore, 10) : 0,
  };

  return <Certificate learnerName={userData.learnerName} courseName={userData.courseName} issuedDate={userData.issuedDate} />;
}