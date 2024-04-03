export default abstract class Constants {
  static readonly BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

  static readonly MAX_AVATAR_SIZE = parseInt(`${import.meta.env.VITE_MAX_AVATAR_SIZE}`, 10);

  static readonly NAVIGATE_PREVIOUS_PAGE = -1;

  static readonly APPLICATION_NAME = "MyGameList";
}
