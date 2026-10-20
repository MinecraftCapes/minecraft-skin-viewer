import type {
  BoxGeometry,
  BufferGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Timer,
  WebGLRenderer,
} from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import type { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import type { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

/**
 * Options used to create a Minecraft skin viewer
 */
export interface MinecraftSkinViewerOptions {
  /**
   * The canvas used to render the player
   */
  canvas: HTMLCanvasElement;
  /**
   * Whether to animate the player, defaults to false when omitted
   */
  animate?: boolean;
  /**
   * Whether to use an orthographic camera instead of a perspective camera
   */
  isometric?: boolean;
  /**
   * The skin path, url or base64; null or undefined loads a random Steve or Alex skin
   */
  skin?: string | null;
  /**
   * The model to use (classic or slim, case-insensitive); null or undefined will guess
   */
  model?: string | "classic" | "slim" | null;
  /**
   * The cape path, url or base64; null or undefined leaves the cape and elytra hidden
   */
  cape?: string | null;
  /**
   * The ears path, url or base64; null or undefined leaves the ears hidden
   */
  ears?: string | null;
  /**
   * Whether to flip the player upside down, defaults to false
   */
  dinnerbone?: boolean;
  /**
   * Whether to give the cape a glint effect, defaults to false
   */
  glint?: boolean;
}

/**
 * Shared mesh and texture operations for a player part
 */
interface Render<TMesh, TMaterial> {
  /**
   * The cached mesh, or null after resetting the player mesh
   */
  mesh: TMesh;
  /**
   * The material used to render this part
   */
  material: TMaterial;
  /**
   * The current texture, or null or undefined when no texture is assigned
   */
  texture?: Texture | null;
  /**
   * Create a translated box geometry and append it to the supplied array
   *
   * @param width - The box width in model units
   * @param height - The box height in model units
   * @param depth - The box depth in model units
   * @param position - The translation applied to the geometry
   * @param geometries - The array to append the geometry to
   */
  createCube(
    width: number,
    height: number,
    depth: number,
    position: { x: number; y: number; z: number },
    geometries: BoxGeometry[]
  ): void;
  /**
   * Map a box geometry to a region of a Minecraft texture
   *
   * @param geometry - The indexed box geometry to update
   * @param startX - The horizontal texture offset in pixels
   * @param startY - The vertical texture offset in pixels
   * @param width - The box width in texture pixels
   * @param height - The box height in texture pixels
   * @param depth - The box depth in texture pixels
   * @param textureWidth - The full texture width in pixels
   * @param textureHeight - The full texture height in pixels
   */
  createUVMap(
    geometry: BufferGeometry,
    startX: number,
    startY: number,
    width: number,
    height: number,
    depth: number,
    textureWidth: number,
    textureHeight: number
  ): void;
  /**
   * Check whether a texture is assigned to this part
   */
  hasTexture(): boolean;
  /**
   * Update the texture and visibility of this part
   *
   * @param texture - The texture to use; null or undefined hides the part
   * @param visible - Whether to show the part when a texture is supplied, defaults to true
   */
  updateTexture(texture: Texture | null | undefined, visible?: boolean): void;
  /**
   * Get the cached mesh, creating it if needed
   */
  getMesh(): NonNullable<TMesh>;
}

/**
 * The player skin mesh and material
 */
interface PlayerRender extends Render<Group | null, MeshStandardMaterial> {
  /**
   * Get the cached player mesh, creating it if needed
   *
   * @param slim - Whether to use slim arms when creating the mesh, defaults to false
   */
  getMesh(slim?: boolean): Group;
  /**
   * Reset the cached player mesh so it can be rebuilt
   */
  resetMesh(): void;
  /**
   * Create a new player mesh without updating the cached mesh
   *
   * @param slim - Whether to use slim arms, defaults to false
   */
  generateMesh(slim?: boolean): Group;
}

/**
 * The ears mesh and material
 */
interface EarRender
  extends Render<Mesh<BufferGeometry, MeshStandardMaterial>, MeshStandardMaterial> {
  /**
   * Create a new ears mesh without updating the cached mesh
   */
  generateMesh(): Mesh<BufferGeometry, MeshStandardMaterial>;
}

/**
 * A player part with animated texture and glint support
 */
interface AnimatedRender<TGeometry extends BufferGeometry>
  extends Render<Mesh<TGeometry, ShaderMaterial>, ShaderMaterial> {
  /**
   * The next texture frame to display, starting at 1
   */
  currentFrame: number;
  /**
   * The time of the last texture frame update in milliseconds since the Unix epoch
   */
  lastFrameTime: number;
  /**
   * Advance the texture animation and glint offset
   *
   * @param delta - The elapsed time in seconds, used to advance the glint offset
   */
  animate(delta?: number): void;
  /**
   * Create a new mesh without updating the cached mesh
   */
  generateMesh(): Mesh<TGeometry, ShaderMaterial>;
}

/**
 * The cape mesh with an optional enchantment glint
 */
interface CapeRender extends AnimatedRender<BoxGeometry> {
  /**
   * The texture used for the enchantment glint
   */
  glintTexture: Texture;
  /**
   * Toggle the cape glint effect
   *
   * @param value - Whether to show the glint effect or not
   */
  toggleGlint(value: boolean): void;
}

/**
 * The player model and its individual rendered parts
 */
interface PlayerObject {
  /**
   * The group containing the skin, ears, cape and elytra
   */
  group: Group;
  /**
   * The player skin renderer
   */
  skin: PlayerRender;
  /**
   * The ears renderer
   */
  ears: EarRender;
  /**
   * The cape renderer
   */
  cape: CapeRender;
  /**
   * The elytra renderer
   */
  elytra: AnimatedRender<BufferGeometry>;
  /**
   * Rebuild the player mesh with the selected arm width
   *
   * @param slim - Whether to use slim arms instead of classic arms
   */
  setSlim(slim: boolean): void;
}

/**
 * Render a Minecraft player with optional cape, ears and animation
 */
export default class MinecraftSkinViewer {
  /**
   * Create a viewer, load its textures and start the render loop
   *
   * @param options - The canvas and initial appearance settings
   */
  constructor(options: MinecraftSkinViewerOptions);

  /**
   * The canvas used by the renderer
   */
  canvas: HTMLCanvasElement;
  /**
   * The WebGL renderer used to draw the scene
   */
  renderer: WebGLRenderer;
  /**
   * The scene containing the player, camera and lighting
   */
  scene: Scene;
  /**
   * The viewing camera; orthographic when isometric is enabled, perspective otherwise
   */
  camera: OrthographicCamera | PerspectiveCamera;
  /**
   * The post-processing composer used to render each frame
   */
  composer: EffectComposer;
  /**
   * The pass that renders the scene through the camera
   */
  renderPass: RenderPass;
  /**
   * The FXAA pass used to smooth rendered edges
   */
  fxaaPass: ShaderPass;
  /**
   * The texture loader used to load ears
   */
  textureLoader: TextureLoader;
  /**
   * The orbit controls for camera movement and automatic rotation
   */
  controls: OrbitControls;
  /**
   * The player model and its rendered parts
   */
  playerObject: PlayerObject;
  /**
   * The timer used to track animation elapsed time and frame delta
   */
  timer: Timer;
  /**
   * Whether the player is animated; may be undefined when omitted in options
   */
  animatePlayer: boolean | undefined;

  /**
   * Resize the renderer and update the camera to match the canvas display size
   *
   * @returns Whether the renderer was resized
   */
  resizeRendererToDisplaySize(): boolean;
  /**
   * Render a frame and schedule the next animation frame
   *
   * Called automatically by the constructor; additional calls start extra render loops
   */
  animate(): void;
  /**
   * Normalize an image source for texture loading
   *
   * @param src - A blob, http, https or image data url, a path starting with ./ or /, or raw base64
   * @returns The original source, or a PNG data url for raw base64
   */
  formatSrc(src: string): string;

  /**
   * Load a skin asynchronously using a relative path, url or base64
   *
   * @param skin - The skin to load; null or undefined loads a random Steve or Alex skin
   * @param model - The model to use (classic or slim, case-insensitive); null or undefined will guess
   * @param dontFailOver - An optional failover parameter, defaults to false. If true, it will not fallback to Steve/Alex if skin fails to load
   */
  loadSkin(skin?: string | null, model?: string | "classic" | "slim" | null, dontFailOver?: boolean): void;
  /**
   * Load a cape asynchronously using a relative path, url or base64
   *
   * @param cape - The cape to load; null or undefined removes the cape/elytra texture
   */
  loadCape(cape?: string | null): void;
  /**
   * Load ears asynchronously using a relative path, url or base64
   *
   * @param ears - The ears to load; null or undefined removes the ears
   */
  loadEars(ears?: string | null): void;
  /**
   * Switch between the cape and elytra when either is visible
   *
   * @param elytra - Whether to show the elytra instead of the cape
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
   * Set whether the player should be animated
   *
   * @param value - Whether to animate the player; texture animation continues either way
   */
  setAnimated(value: boolean): void;
  /**
   * Stop the render loop and dispose of the renderer, post-processing resources and player materials
   */
  dispose(): void;
}
