export const sceneInput = {
  Workbench: 1119,
  OmnipotencePlus: 1121,
  Profile: 1120
};

export function inputWorkbench() {
  const app = getApp();
  return (
    app.globalData.scene !== sceneInput.OmnipotencePlus &&
    app.globalData.scene !== sceneInput.Profile
  );
}
