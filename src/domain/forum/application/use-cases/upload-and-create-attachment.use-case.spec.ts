import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments.repository';
import { FakeUploader } from '@/test/storage/fake-uploader';

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment.use-case';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload And Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    fakeUploader = new FakeUploader();

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    );
  });

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    const attachment = inMemoryAttachmentsRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ attachment });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
    expect(fakeUploader.uploads).toHaveLength(0);
  });
});
