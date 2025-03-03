import React from "react";
import { useProjectData } from "@/app/data/DataFetch";
import ProjectTable from "./ProjectTable";

export default function Project() {
  const { data: projects } = useProjectData([]);
  return <ProjectTable projectsData={projects} />;
}
