import Frame2275 from "@/views/Frame2275";
import Frame2139 from "@/views/Frame2139";
import Frame296 from "@/views/Frame296";
import Frame213 from "@/views/Frame213";

export const routes = [{
          path: "/frame2275",
          component: Frame2275,
          guid: "2:275",
        },
{
          path: "/frame2139",
          component: Frame2139,
          guid: "2:139",
        },
{
          path: "/frame296",
          component: Frame296,
          guid: "2:96",
        },
{
          path: "/",
          component: Frame213,
          guid: "2:13",
        }];


export const guidPathMap = new Map(
  routes.map((item) => [item.guid, item.path])
);
export const pathGuidMap = new Map(
  routes.map((item) => [item.path, item.guid])
);

export const getPathByGuid = (guid: string) => {
  return guidPathMap.get(guid) || "";
};

export const getGuidByPath = (path: string) => {
  return pathGuidMap.get(path) || "";
};
