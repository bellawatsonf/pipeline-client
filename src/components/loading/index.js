import styleLoading from "./loading.module.css";

export function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div className={`${styleLoading.loader}`}></div>
    </div>
  );
}
