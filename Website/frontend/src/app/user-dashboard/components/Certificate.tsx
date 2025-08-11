"use client";

import Image from "next/image";
import logo from "/public/yego-shecan-logo.png";
import "./certificate.css"; 

interface CertificateProps {
  learnerName: string;
  courseName: string;
  finalScore: number;
  issuedDate: string;
}

export default function Certificate({
  learnerName,
  courseName,
  finalScore,
  issuedDate,
}: CertificateProps) {
  return (
    <div className="certificate-container">
      <div className="certificate">
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-right"></div>
        <div className="corner bottom-left"></div>

        <Image
          src={logo}
          alt="Yego SheCan Logo"
          className="cert-logo"
          width={80}
          height={80}
        />

        <h1 className="cert-title">CERTIFICATE OF EXCELLENCE</h1>
        <p className="cert-presented-to">IS PROUDLY PRESENTED TO</p>
        <h2 className="cert-name">{learnerName}</h2>

        <p className="cert-body">
          FOR SUCCESSFULLY COMPLETING THE COURSE <br />
          <strong>{courseName}</strong>
        </p>

        <div className="cert-footer">
          <div>
            <div className="cert-line"></div>
            <p className="cert-footer-label">DATE</p>
            <p>{issuedDate}</p>
          </div>
          <div>
            <div className="cert-line"></div>
            <p className="cert-footer-label">SIGNATURE</p>
            <p>Yego SheCan Program</p>
          </div>
        </div>
      </div>
    </div>
  );
}