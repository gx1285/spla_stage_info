const fs = require("fs");
window.addEventListener("DOMContentLoaded", async () => {
  switch (document.title) {
    case "ホーム - Spla Stage Info":
      const base = "https://spla3.yuu26.com/api";
      const req = new Request(`${base}/regular/now`, {
        headers: {
          "user-agent":
            "spla_stage_info/0.0.1(https://github.com/gx1285/spla_stage_info)",
        },
      });
      const res = await fetch(req);
      try {
        if (res.ok) {
          let results = await res.json();
          fs.writeFileSync(
            `../save_date/${results.results[0].start_time
              .replace("T", "-")
              .replace(":", "-")
              .replace(":", "-")
              .replace("+09:00", "")}.json`,
            JSON.stringify(results)
          );

          document
            .getElementById("1-1")
            .setAttribute("src", results.results[0].stages[0].image);
          document
            .getElementById("1-4")
            .setAttribute("src", results.results[0].stages[1].image);
          document.getElementById("1-2").innerText =
            "今のレギュラーマッチのステージ";
          document.getElementById("1-3").innerText =
            results.results[0].stages[0].name +
            "と" +
            results.results[0].stages[1].name;
        } else {
          console.log("not ok");
          document.getElementById("1-2").innerText = "❌｜読み込みできません。";
          document.getElementById("1-3").innerText = "❌｜読み込みできません。";
        }
      } catch (E) {
        console.log(E);
        console.log("err1");
        document.getElementById("1-2").innerText = "❌｜読み込みできません。";
        document.getElementById("1-3").innerText = "❌｜読み込みできません。";
      }
      break;
  }
});
