import { BaseModel } from '../models';

export interface Team {
  id: string;
  name: string;
}

export interface BackendProject {
  id: string;
  name: string;
  rootDocumentId: string;
}

export type DocumentKey = string;

export type BlobId = string;

export interface Head {
  branch: string;
}

export interface SnapshotStateEntry {
  key: DocumentKey;
  blob: BlobId;
  name: string;
}

export type SnapshotState = SnapshotStateEntry[];

export type SnapshotStateMap = Record<DocumentKey, SnapshotStateEntry>;

export type SnapshotId = string;

export interface Snapshot {
  id: SnapshotId;
  created: Date;
  parent: string;
  author: string;
  name: string;
  description: string;
  state: SnapshotStateEntry[];
  // Only exists in Snapshots that are pulled from the server
  authorAccount?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
/**** ><> ↑ --------- Interface Definitions - Snapshot and related ->  */

export interface Branch {
  name: string;
  created: Date;
  modified: Date;
  snapshots: string[];
}
/**** ><> ↑ --------- Interface Definition - Branch ->  */

export interface StageEntryDelete {
  deleted: true;
  key: string;
  name: string;
  blobId: string;
}
/**** ><> ↑ --------- Interface Definitions ->  */

export interface StageEntryAdd {
  added: true;
  key: string;
  name: string;
  blobId: string;
  blobContent: string;
}

export interface StageEntryModify {
  modified: true;
  key: string;
  name: string;
  blobId: string;
  blobContent: string;
}
/**** ><> ↑ --------- Interface Definitions - Stage Entries ->  */

export type StageEntry = StageEntryDelete | StageEntryAdd | StageEntryModify;
/**** ><> ↑ --------- Export Type Definition - StageEntry ->  */

export interface MergeConflict {
  name: string;
  key: DocumentKey;
  message: string;
  mineBlob: BlobId | null;
  theirsBlob: BlobId | null;
  choose: BlobId | null;
}
/**** ><> ↑ --------- Interface Definition - MergeConflict ->  */

export type Stage = Record<DocumentKey, StageEntry>;
/**** ><> ↑ --------- Export Type Definition - Stage ->  */

export interface StatusCandidate {
  key: DocumentKey;
  name: string;
  document: BaseModel;
}
/**** ><> ↑ --------- Interface Definition - StatusCandidate ->  */

export type StatusCandidateMap = Record<DocumentKey, StatusCandidate>;
/**** ><> ↑ --------- Export Type Definition - StatusCandidateMap ->  */

export interface Status {
  key: string;
  stage: Stage;
  unstaged: Record<DocumentKey, StageEntry>;
}
/**** ><> ↑ --------- Interface Definition - Status ->  */
