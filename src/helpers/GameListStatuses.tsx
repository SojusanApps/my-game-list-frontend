export default abstract class StatusCode {
  static readonly COMPLETED = "C";

  static readonly PLAN_TO_PLAY = "PTP";

  static readonly PLAYING = "P";

  static readonly DROPPED = "D";

  static readonly ON_HOLD = "OH";

  static readonly ALL = [this.COMPLETED, this.PLAN_TO_PLAY, this.PLAYING, this.DROPPED, this.ON_HOLD];

  static readonly CODE_TO_VALUE_MAPPING = [
    { code: this.COMPLETED, value: "Completed" },
    { code: this.PLAN_TO_PLAY, value: "Plan to Play" },
    { code: this.PLAYING, value: "Playing" },
    { code: this.DROPPED, value: "Dropped" },
    { code: this.ON_HOLD, value: "On Hold" },
  ];
}
