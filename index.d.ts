export default class MinecraftSkinViewer {
  constructor(options: {
    canvas: HTMLCanvasElement
    skin?: string
    cape?: string
    ears?: string
    dinnerbone?: boolean
    glint?: boolean
  });

  /**
   * Load a skin using a relative path, url or base64
   * 
   * @param skin - The skin to load, setting to `null` will load a random Steve or Alex skin
   */
  loadSkin(skin: string | null): void;
  /**
   * Load a cape using a relative path, url or base64
   * 
   * @param cape - The cape to load, setting to `null` to remove the cape/elytra texture
   */
  loadCape(cape: string | null): void;
  /**
   * Load a ears using a relative path, url or base64
   * 
   * @param ears - The ears to load, setting to `null` to remove the ears
   */
  loadEars(ears: string | null): void;
  /**
   * Toggle the elytra
   * 
   * @param elytra - Whether to show the elytra or not
   */
  setElytra(elytra: boolean): void;
  /**
   * Flip the player model
   * 
   * @param dinnerbone - Whether to flip the player model or not
   */
  setDinnerbone(dinnerbone: boolean): void;
  /**
   * Give the cape a glint effect
   * 
   * @param glint - Whether to show the glint effect or not
   */
  setGlint(glint: boolean): void;
  /**
   * Dispose of the viewer and free up resources
   */
  dispose(): void;
}
