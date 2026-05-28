import { createFileRoute } from "@tanstack/react-router";
import Portfolio from "@/components/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alex Rivera — Full-Stack Engineer & AI Systems Architect" },
      { name: "description", content: "Portfolio of Alex Rivera — building scalable systems, AI platforms, and ambitious software." },
    ],
  }),
  component: Portfolio,
});
