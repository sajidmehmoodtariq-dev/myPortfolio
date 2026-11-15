import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { credentials } from "../../../content/credentials";
import styles from "./certificate.module.css";

type Props = { params: Promise<{ id: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return credentials.map(({ id }) => ({ id }));
}

async function getCredential(params: Props["params"]) {
  const { id } = await params;
  const credential = credentials.find((entry) => entry.id === id);
  if (!credential) notFound();
  return credential;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const credential = await getCredential(params);
  return {
    title: `${credential.code} course completion`,
    description: `${credential.title}, completed by ${credential.recipient} in ${credential.year}.`,
  };
}

export default async function CertificatePage({ params }: Props) {
  const credential = await getCredential(params);
  return (
    <main className={styles.viewer}>
      <Link href={`/#${credential.id}`} className={styles.back}>← Back to the learning archive</Link>
      <header className={styles.heading} data-reveal="intro">
        <p>{credential.issuer} · {credential.year}</p>
        <h1>{credential.code} course completion</h1>
        <p>{credential.title} · {credential.coursework}</p>
        <nav aria-label="Certificate actions" className={styles.actions}>
          <a href={credential.pdf} download>Download original PDF</a>
          <a href={credential.verificationUrl} target="_blank" rel="noopener">Verify credential ↗</a>
        </nav>
      </header>
      <figure className={styles.document} data-reveal="intro">
        <a href={credential.inspectionPreview} target="_blank" rel="noopener" aria-label="Open full-resolution certificate image">
          <Image src={credential.inspectionPreview} alt={`${credential.code} certificate for ${credential.recipient}`}
            width={2200} height={1700} unoptimized loading="eager" />
        </a>
        <figcaption>Open the image for a full-resolution view.</figcaption>
      </figure>
    </main>
  );
}
