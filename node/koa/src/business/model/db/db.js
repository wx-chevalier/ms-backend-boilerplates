// @flow

export const db = {
  select: function(callback) {
    //模拟三秒时延
    setTimeout(callback({ user_name: "robocaap" }), 3000);
  }
};
