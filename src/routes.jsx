import Skybox from "@/pages/skybox";

const routes = [
  {
    path: "/skybox/:hdrId",
    override: "/skybox/1",
    name: "skybox",
    element: <Skybox />,
  },
];

export default routes;
