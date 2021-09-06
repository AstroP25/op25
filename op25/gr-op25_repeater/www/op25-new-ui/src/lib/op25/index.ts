// function term_config(d: any) {
// TODO: Remove ANY Type
//   var lg_step = 1200;
//   var sm_step = 100;
//   var updated = 0;
//   if (
//     d["tuning_step_large"] != undefined &&
//     d["tuning_step_large"] != lg_step
//   ) {
//     lg_step = d["tuning_step_large"];
//     updated++;
//   }
//   if (
//     d["tuning_step_small"] != undefined &&
//     d["tuning_step_small"] != sm_step
//   ) {
//     sm_step = d["tuning_step_small"];
//     updated++;
//   }
//   if (updated) {
//     set_tuning_step_sizes(lg_step, sm_step);
//   }
// }
// function set_tuning_step_sizes(lg_step = 1200, sm_step = 100) {
//   var title_str = "Adjust tune ";
//   var bn_t1_U = document.getElementById("t1_U");
//   var bn_t2_U = document.getElementById("t2_U");
//   var bn_t1_D = document.getElementById("t1_D");
//   var bn_t2_D = document.getElementById("t2_D");
//   var bn_t1_u = document.getElementById("t1_u");
//   var bn_t2_u = document.getElementById("t2_u");
//   var bn_t1_d = document.getElementById("t1_d");
//   var bn_t2_d = document.getElementById("t2_d");
//   if (bn_t1_U != null && bn_t2_U != null) {
//     bn_t1_U.setAttribute("title", title_str + "+" + lg_step);
//     bn_t2_U.setAttribute("title", title_str + "+" + lg_step);
//     bn_t1_U.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(" + lg_step + ");"
//     );
//     bn_t2_U.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(" + lg_step + ");"
//     );
//   }
//   if (bn_t1_D != null && bn_t2_D != null) {
//     bn_t1_D.setAttribute("title", title_str + "-" + lg_step);
//     bn_t2_D.setAttribute("title", title_str + "-" + lg_step);
//     bn_t1_D.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(-" + lg_step + ");"
//     );
//     bn_t2_D.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(-" + lg_step + ");"
//     );
//   }
//   if (bn_t1_u != null && bn_t2_u != null) {
//     bn_t1_u.setAttribute("title", title_str + "+" + sm_step);
//     bn_t2_u.setAttribute("title", title_str + "+" + sm_step);
//     bn_t1_u.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(" + sm_step + ");"
//     );
//     bn_t2_u.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(" + sm_step + ");"
//     );
//   }
//   if (bn_t1_d != null && bn_t2_d != null) {
//     bn_t1_d.setAttribute("title", title_str + "-" + sm_step);
//     bn_t2_d.setAttribute("title", title_str + "-" + sm_step);
//     bn_t1_d.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(-" + sm_step + ");"
//     );
//     bn_t2_d.setAttribute(
//       "onclick",
//       "javascript:f_tune_button(-" + sm_step + ");"
//     );
//   }
// }

// function rx_update(d) {
//   plotfiles = [];
//   if ((d["files"] != undefined) && (d["files"].length > 0)) {
//       for (var i=0; i < d["files"].length; i++) {
//           if (channel_list.length > 0) {
//               expr = new RegExp("plot\-" + channel_list[channel_index] + "\-");
//           }
//           else {
//               expr = new RegExp("plot\-0\-");
//           }

//           if (expr.test(d["files"][i])) {
//               plotfiles.push(d["files"][i]);
//           }
//       }

//       for (var i=0; i < 5; i++) {
//           var img = document.getElementById("img" + i);
//           if (i < plotfiles.length) {
//               if (img['src'] != plotfiles[i]) {
//                   img['src'] = plotfiles[i];
//                   img.style["display"] = "";
//               }
//           }
//           else {
//               img.style["display"] = "none";
//           }
//       }
//   }
//   else {
//       var img = document.getElementById("img0");
//       img.style["display"] = "none";
//   }
//   if (d["error"] != undefined)
//       error_val = d["error"];
//   if (d["fine_tune"] != undefined)
//       fine_tune = d["fine_tune"];
// }

import { Draft } from "@reduxjs/toolkit";
import { Channels } from "types/Channel";
import {
  OP25ChannelUpdateChannelData,
  OP25TypeChannelUpdate,
  OP25TypeTerminalConfig,
} from "types/OP25";
import { OP25State } from "types/OP25State";
import { TerminalConfig } from "types/TerminalConfig";

export const frequencyToString = (frequency: number) => {
  return (frequency / 1000000.0).toFixed(6);
};

export const ppmToString = (ppm: number) => {
  return ppm.toFixed(3);
};

export const channel_update = (
  data: OP25TypeChannelUpdate,
  state: Draft<OP25State>
) => {
  if (data.json_type === "channel_update" && data.channels) {
    let channels: Channels = [];

    for (const channel in data.channels) {
      const channelData = data[channel] as OP25ChannelUpdateChannelData;
      channels.push({
        id: Number.parseInt(channel),
        encrypted: channelData.encrypted === 1,
        frequency: channelData.freq,
        mode: channelData.mode,
        name: channelData.name,
        sourceAddress: channelData.srcaddr,
        sourceTag: channelData.srctag,
        stream: channelData.stream,
        msgqid: channelData.msgqid,
        ppm: channelData.ppm,
        systemName: channelData.system,
        tdma: channelData.tdma,
        tgID: channelData.tgid,
        tgTag: channelData.tag,
      });
    }

    state.channels = channels;
  }
};

export const terminal_config = (
  data: OP25TypeTerminalConfig,
  state: Draft<OP25State>
) => {
  if (data.json_type === "terminal_config") {
    const config: TerminalConfig = {
      module: data.module,
      terminalType: data.terminal_type,
      cursesPlotInterval: data.curses_plot_interval,
      httpPlotInterval: data.http_plot_interval,
      httpPlotDirectory: data.http_plot_directory,
      tuningStepSizeLarge: data.tuning_step_large,
      tuningStepSizeSmall: data.tuning_step_small,
    };

    state.terminalConfig = config;
  }
};
