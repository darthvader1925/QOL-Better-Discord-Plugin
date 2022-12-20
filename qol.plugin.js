/**
 * @name QOLPlugin
 * @author ghostyval
 * @description A QOL Plugin with button hiding, lock screen etc.
 * @version 0.0.1
 */

module.exports = meta => {
  const shade = document.createElement("div")
  const password_input = document.createElement("div")


  const defaults = {
    password: "",
    hide_msg_icons: false,
    hide_channel_icons: false  
  };

  const settings = {};

  const stored_data = BdApi.loadData(meta.name, "settings");
  Object.assign(settings, defaults, stored_data);

  return {
    start: () => {

      // Password/Lock 
      //BdApi.alert("Welcome!", "QOL Plugin activated.");
      var idleTime = 0;
      var idleInterval = setInterval(timerIncrement, 60000);
      var inAnimationPhase = false;

      const mo = document.addEventListener("mousemove", resetIdle)
      const kp = document.addEventListener("keypress", (e) => {
        idleTime = 0;
        if (password_input.style.display == "block") {
          if (!e) e = event;
          if (!isNumeric(String.fromCharCode(e.which))) return
          e.preventDefault();
          inputtedPassword += String.fromCharCode(e.which);
          document.querySelector("#bd-discordpswrd-qol-input").value = inputtedPassword;
          authPassword();
        }
      });

      function resetIdle() {
        idleTime = 0;
      }

      function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 4) { // 5 minutes
          window.location.reload();
        }
      }

      shade.style.position = "fixed";
      shade.style.top = "0%";
      shade.style.left = "0%";
      shade.style.background = "black"
      shade.style.width = "100%";
      shade.style.height = "100%";
      shade.style.opacity = "0.95";
      shade.style.zIndex = "9998";
      shade.style.display = "none";
      shade.id = "bd-discordpswrd-qol-shade";
      document.body.append(shade)


      password_input.style.position = "fixed";
      password_input.style.top = "55%";
      password_input.style.left = "50%";
      password_input.style.background = "transparent";
      password_input.style.width = "50%";
      password_input.style.height = "50%";
      password_input.style.zIndex = "9999";
      password_input.style.display = "none"
      password_input.style.opacity = "1"
      password_input.style.color = "white";
      password_input.style.textAlign = "center";
      password_input.style.transform = "translate(-50%, -50%)";
      password_input.id = "bd-discordpswrd-qol-pl"
      password_input.innerHTML = `
      <h1 style="text-decoration: underline;">Enter Discord Password</h1>
      <br><br>
      <input type="password" id="bd-discordpswrd-qol-input" disabled>
      <br><br>
      <span align="center" class="bd-discordpswrd-qol-num" style="margin-left: 50px;">1</span> <span align="center" class="bd-discordpswrd-qol-num">2</span> <span align="center" class="bd-discordpswrd-qol-num">3</span>
      <br><br>
      <span align="center" class="bd-discordpswrd-qol-num" style="margin-left: 50px;">4</span> <span align="center" class="bd-discordpswrd-qol-num">5</span> <span align="center" class="bd-discordpswrd-qol-num">6</span>
      <br><br>
      <span align="center" class="bd-discordpswrd-qol-num" style="margin-left: 50px;">7</span> <span align="center" class="bd-discordpswrd-qol-num">8</span> <span align="center" class="bd-discordpswrd-qol-num">9</span>
      <br><br>
      <span align="center" id="bd-discordpswrd-qol-backspace"><span style="font-size: 55px; vertical-align: middle;" data="bd-discordpswrd-qol-backspace">&#x2190;</span> <span style="font-size: 20px; vertical-align: middle;" data="bd-discordpswrd-qol-backspace">Backspace</span></span>
      `
      document.body.append(password_input)

      BdApi.injectCSS("QOLPlugin", `
    .bd-discordpswrd-qol-num:hover {
      color: #0be3ca;
    }

    #bd-discordpswrd-qol-input {
      border: none; 
      border-bottom: 1.5px solid white; 
      width: 200px; color: white; 
      font-size: 45px; 
      text-align: center; 
      background: transparent;
      transition: .5s;
    }

    .bd-discordpswrd-qol-num {
      font-size: 30px; 
      margin-right: 50px; 
      margin-bottom: 50px; 
      cursor: pointer; 
      text-align: center;
      width: 20px;
      transition: 1.5s;
    }

    #bd-discordpswrd-qol-backspace {
      transition: 1.5s;
      cursor: pointer;
      color: white;
    }

    #bd-discordpswrd-qol-backspace:hover {
      color: #0be3ca;
    }
  `);

      const detectKeyShow = document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.keyCode == 76) {
          if (shade.style.display == "none") {
            password_input.style.display = "block"
            shade.style.display = "block"
            document.querySelector("#bd-discordpswrd-qol-input").focus();
          } else {
            password_input.style.display = "none"
            shade.style.display = "none"
          }
        }
      })

      var inputtedPassword = "";
      const detectNumPress = document.addEventListener("click", (e) => {
        if (!password_input.style.display == "none") return;
        if (inAnimationPhase == true) return;
        if (isNumeric(e.target.innerHTML) && !inAnimationPhase) {
          inputtedPassword += e.target.innerHTML;
          document.querySelector("#bd-discordpswrd-qol-input").value = inputtedPassword;
          authPassword();
        } else if (e.target.getAttribute("data") == "bd-discordpswrd-qol-backspace" && inputtedPassword.length > 0 && !inAnimationPhase) {
          inputtedPassword = inputtedPassword.slice(0, -1)
          document.querySelector("#bd-discordpswrd-qol-input").value = inputtedPassword;
        } else if (e.shiftKey && e.ctrlKey && e.keyCode == 73 && password_input.style.display == "block") {
          e.preventDefault();
        }
      })

      function isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) &&
          !isNaN(parseFloat(str))
      }

      function authPassword() {
        if (inputtedPassword.length == 4) {
          if (inputtedPassword == "1224") {
            document.querySelector("#bd-discordpswrd-qol-input").style.color = "#0be3ca"
            inputtedPassword = "";
            inAnimationPhase = true;
            setTimeout(function () {
              password_input.style.display = "none"
              shade.style.display = "none"
              document.querySelector("#bd-discordpswrd-qol-input").style.color = "white"
              document.querySelector("#bd-discordpswrd-qol-input").value = ""
              inAnimationPhase = false;
              return
            }, 1200)
          } else {
            document.querySelector("#bd-discordpswrd-qol-input").style.color = "red"
            inputtedPassword = "";
            inAnimationPhase = true;
            setTimeout(function () {
              document.querySelector("#bd-discordpswrd-qol-input").value = ""
              document.querySelector("#bd-discordpswrd-qol-input").style.color = "white"
              inAnimationPhase = false;
              return
            }, 500)
          }
        }
      }

      // Hide icons
      function hideIcons() {
        console.log("hiding icons");
        document.querySelectorAll(".buttonWrapper-3YFQGJ").forEach(button => {
          if (settings["hide_msg_icons"] == false) return
          button.style.display = 'none'; // message bar
        })

        document.querySelectorAll(".icon-2W8DHg").forEach(button => {
          if (settings["hide_channel_icons"] == false) return
          button.style.display = 'none'; // channel icons
        })

        //setInterval(hideIcons, 60000);
      }
      hideIcons();
    },

    stop: () => {
      BdApi.clearCSS("QOLPlugin");
      shade.remove()
      password_input.remove()
      //document.removeEventListener("keydown", detectKeyShow)
      //document.removeEventListener("keypress", kp)
      //document.removeEventListener("mousemove", mo)
    },
    onSwitch: () => {
      function hideIcons() {
        console.log("hiding icons");
        document.querySelectorAll(".buttonWrapper-3YFQGJ").forEach(button => {
          if (settings["hide_msg_icons"] == false) return
          button.style.display = 'none'; // message bar
        })

        document.querySelectorAll(".icon-2W8DHg").forEach(button => {
          if (settings["hide_channel_icons"] == false) return
          button.style.display = 'none'; // channel icons
        })
      }
      hideIcons();
    },
    getSettingsPanel: () => {
      const panel = document.createElement("div");
      panel.id = "bd-discordpswrd-settings-panel";

      const titleIcons = document.createElement("h2");
      titleIcons.innerHTML = "Icons"
      titleIcons.style.color = "white"
      titleIcons.style.fontWeight = "bold"
      titleIcons.style.marginBottom = "10px";

      panel.appendChild(titleIcons);

      const showChannelIcons = document.createElement("div");
      showChannelIcons.classList.add("setting");

      const sci_l = document.createElement("span")
      sci_l.innerHTML = "Hide Channel Icons (#)";
      sci_l.style.marginLeft = "10px";
      sci_l.style.color = "white"
      sci_l.style.verticalAlign = "middle"

      const sci = document.createElement("input");
      sci.type = "checkbox";
      sci.style.cursor = "pointer";
      sci.style.height = "20px";
      sci.style.width = "20px";
      sci.style.verticalAlign = "middle"

      if (settings["hide_channel_icons"] == true) {
        sci.checked = true;
      } else {
        sci.checked = false;
      }

      sci.addEventListener("change", (e) => {
        if (sci.checked) {
          settings["hide_channel_icons"] = true;
          BdApi.saveData(meta.name, "settings", settings);
        } else {
          settings["hide_channel_icons"] = false;
          BdApi.saveData(meta.name, "settings", settings);
        }
      })

      showChannelIcons.append(sci, sci_l);


      const showMessageIcons = document.createElement("div");
      showMessageIcons.classList.add("setting");

      const smi_l = document.createElement("span")
      smi_l.innerHTML = "Hide Message Box Icons";
      smi_l.style.marginLeft = "10px";
      smi_l.style.color = "white"
      smi_l.style.height = "20px";
      smi_l.style.width = "20px";
      smi_l.style.verticalAlign = "middle"

      const smi = document.createElement("input");
      smi.type = "checkbox";
      smi.style.cursor = "pointer";
      smi.style.height = "20px";
      smi.style.width = "20px";
      smi.style.verticalAlign = "middle";

      if (settings["hide_msg_icons"] == true) {
        smi.checked = true;
      } else {
        smi.checked = false;
      }

      smi.addEventListener("change", (e) => {
        if (smi.checked) {
          settings["hide_msg_icons"] = true;
          BdApi.saveData(meta.name, "settings", settings);
        } else {
          settings["hide_msg_icons"] = false;
          BdApi.saveData(meta.name, "settings", settings);
        }
      })

      showMessageIcons.append(smi, smi_l);

      const titlePs = document.createElement("h2");
      titlePs.innerHTML = "Password Settings";
      titlePs.style.color = "white"
      titlePs.style.fontWeight = "bold"
      titlePs.style.marginBottom = "10px";
      titlePs.style.marginTop = "10px";

      showMessageIcons.appendChild(titlePs);

      panel.append(showChannelIcons, showMessageIcons);

      return panel;
    }
  }
};
