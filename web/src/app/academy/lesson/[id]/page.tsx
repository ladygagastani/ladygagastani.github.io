import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import LessonView from "@/components/academy/LessonView";
import { LESSONS, lessonById } from "@/data/lessons";
import { AREAS } from "@/config/areas";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/lesson/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `${lessonById(id)?.title ?? "Lesson"} · ${AREAS.study.name}` };
}

export default async function LessonPage({ params }: PageProps<"/academy/lesson/[id]">) {
  const { id } = await params;
  const lesson = lessonById(id);
  if (!lesson) notFound();
  const n = LESSONS.indexOf(lesson) + 1;
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Lesson {n} of {LESSONS.length}</nav>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>{lesson.title} <span lang="grc" style={{ display: "block", fontSize: "0.5em", color: "var(--accent)", marginTop: 8 }}>{lesson.greek}</span></h1>
        <p className="muted" style={{ fontSize: "1.1rem" }}>{lesson.summary} · about {lesson.minutes} minutes</p>
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <LessonView lesson={lesson} />
      </div>
    </Page>
  );
}
