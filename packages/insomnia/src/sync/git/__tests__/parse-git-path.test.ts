import { describe, expect, it } from '@jest/globals';

import * as models from '../../../models';
import { GIT_INSOMNIA_DIR } from '../git-vcs';
import parseGitPath from '../parse-git-path';
/**** ><> ↑ --------- import dependencies ->  */

describe('parseGitPath', () => {
  it('should parse a git path into its root, type and id', () => {
    const gitPath = `${GIT_INSOMNIA_DIR}/${models.workspace.type}/wrk_1.yml`;
    const result = parseGitPath(gitPath);
    expect(result.root).toBe(GIT_INSOMNIA_DIR);
    expect(result.type).toBe(models.workspace.type);
    expect(result.id).toBe('wrk_1');
  });
/**** ><> ↑ --------- unit test: parse a git path into its root, type and id ->  */

  it('should ignore multiple slashes', () => {
    const gitPath = `${GIT_INSOMNIA_DIR}////${models.workspace.type}/wrk_1.yml`;
    const result = parseGitPath(gitPath);
    expect(result.root).toBe(GIT_INSOMNIA_DIR);
    expect(result.type).toBe(models.workspace.type);
    expect(result.id).toBe('wrk_1');
  });
/**** ><> ↑ --------- unit test: ignore multiple slashes ->  */

  it('should ignore current directory . segments', () => {
    const gitPath = `${GIT_INSOMNIA_DIR}/./././${models.workspace.type}/wrk_1.yml`;
    const result = parseGitPath(gitPath);
    expect(result.root).toBe(GIT_INSOMNIA_DIR);
    expect(result.type).toBe(models.workspace.type);
    expect(result.id).toBe('wrk_1');
  });
/**** ><> ↑ --------- unit test: ignore current directory . segments ->  */

  it.each(['json', 'yml'])('should omit the %s extension', ext => {
    const gitPath = `${GIT_INSOMNIA_DIR}/${models.workspace.type}/wrk_1.${ext}`;
    const result = parseGitPath(gitPath);
    expect(result.root).toBe(GIT_INSOMNIA_DIR);
    expect(result.type).toBe(models.workspace.type);
    expect(result.id).toBe('wrk_1');
  });
/**** ><> ↑ --------- unit test: omit the %s extension ->  */

  it('should keep the extension', () => {
    const gitPath = `${GIT_INSOMNIA_DIR}/${models.workspace.type}/wrk_1.somethingelse`;
    const result = parseGitPath(gitPath);
    expect(result.root).toBe(GIT_INSOMNIA_DIR);
    expect(result.type).toBe(models.workspace.type);
    expect(result.id).toBe('wrk_1.somethingelse');
  });
});
/**** ><> ↑ --------- unit test: keep the extension ->  */
