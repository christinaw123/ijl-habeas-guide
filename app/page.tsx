import Container from "@/components/Container";
import FeatureCard from "@/components/FeatureCard";
import PrimaryButton from "@/components/PrimaryButton";

export default function HomePage() {
  return (
    <div className="bg-white">
      <Container>
        {/* generous top spacing like Figma mobile */}
        <div className="mx-auto max-w-3xl py-16 sm:py-20">
          <h1 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950">
            Legal Help Finder
          </h1>

          <p className="mt-8 text-center text-2xl sm:text-3xl leading-snug font-semibold text-slate-600">
            Have you or someone you know been detained by immigration officials?
            Use this tool to find legal aid resources who can help.
          </p>

          <div className="mt-12 sm:mt-14">
            <FeatureCard
              title="Legal Help Finder"
              description="Answer some questions to find help for detainees."
              cta={<PrimaryButton href="/find-help">Get Started</PrimaryButton>}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
