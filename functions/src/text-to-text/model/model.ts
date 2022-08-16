import {ComlinkWorkerInterface, createBergamotWorker, ModelRegistry} from '@sign-mt/browsermt';
import {Bucket} from '@google-cloud/storage';
import * as fs from 'fs';

export class TextToTextTranslationModel {
  private worker!: ComlinkWorkerInterface;

  constructor(private bucket: Bucket, private from: string, private to: string) {}

  async init(files: string[]) {
    const workerPath = require.resolve('@sign-mt/browsermt/build/bundled/worker.js');
    this.worker = createBergamotWorker(workerPath);

    const wasmBinary = fs.readFileSync(require.resolve('@sign-mt/browsermt/artifacts/bergamot-translator-worker.wasm'));

    await this.worker.importBergamotWorker(
      require.resolve('@sign-mt/browsermt/artifacts/bergamot-translator-worker.js'),
      wasmBinary
    );

    const modelName = `${this.from}${this.to}`;
    const modelRegistry = {[modelName]: await this.createModelRegistry(files)} as ModelRegistry;

    console.log(modelRegistry);
    await this.worker.loadModel(this.from, this.to, modelRegistry);
  }

  private async createModelRegistry(files: string[]) {
    const expires = Date.now() + 1000 * 60;
    const modelRegistry: any = {};
    for (const filePath of files) {
      const fileName = filePath.split('/').pop() as string;
      const fileType = fileName.split('.').shift() as string;
      if (!fileType) {
        throw new Error(`Invalid model file name: ${fileName}`);
      }

      // tODO publicUrl
      const [mediaLink] = await this.bucket.file(filePath).getSignedUrl({action: 'read', expires});
      console.log(mediaLink);
      modelRegistry[fileType] = {
        name: mediaLink,
        size: 0,
        estimatedCompressedSize: 0,
        modelType: 'prod',
      };
    }
    return modelRegistry;
  }

  async translate(text: string) {
    const translations: [string] = (await this.worker.translate(this.from, this.to, [text], [{isHtml: false}])) as any;
    return translations[0];
  }

  async terminate() {
    return this.worker.terminate();
  }
}
