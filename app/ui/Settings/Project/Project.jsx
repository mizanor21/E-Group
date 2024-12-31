import React from "react";
import ProjectTable from "./ProjectTable";
import { useProjectData } from "@/app/data/DataFetch";

export default function Project() {
  const { data: projects } = useProjectData([]);
  return <ProjectTable projectsData={projects} />;
}
