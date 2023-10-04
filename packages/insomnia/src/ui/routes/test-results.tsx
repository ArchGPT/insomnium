import React, { FC } from 'react';
import { LoaderFunction, redirect, useRouteLoaderData } from 'react-router-dom';

import { database } from '../../common/database';
import * as models from '../../models';
import { UnitTestResult } from '../../models/unit-test-result';
import { guard } from '../../utils/guard';
import { ListGroup, UnitTestResultItem } from '../components/list-group';

interface TestResultsData {
  testResult: UnitTestResult;
}

export const indexLoader: LoaderFunction = async ({ params }) => {
  const { organizationId, projectId, workspaceId, testSuiteId } = params;
  guard(projectId, 'Project ID is required');
  guard(organizationId, 'Organization ID is required');
  guard(workspaceId, 'Workspace ID is required');
  guard(testSuiteId, 'Test suite ID is required');

  const testResult = await models.unitTestResult.getLatestByParentId(workspaceId);
  if (testResult) {
    return redirect(`/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/test/test-suite/${testSuiteId}/test-result/${testResult._id}`);
  }

  return null;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<TestResultsData> => {
  const { testResultId } = params;
  guard(testResultId, 'Test Result ID is required');
  const testResult = await database.getWhere<UnitTestResult>(models.unitTestResult.type, {
    _id: testResultId,
  });
  guard(testResult, 'Test Result not found');
  return {
    testResult,
  };
};

export const TestRunStatus: FC = () => {
  const { testResult } = useRouteLoaderData(':testResultId') as TestResultsData;

  const { stats, tests } = testResult.results;
  return (
    <div className="unit-tests__results">
      {testResult && (
        <div key={testResult._id}>
          <div className="unit-tests__top-header">
            {stats.failures ? (
              <h2 className="warning">
                Tests Failed {stats.failures}/{stats.tests}
              </h2>
            ) : (
              <h2 className="success">
                Tests Passed {stats.passes}/{stats.tests}
              </h2>
            )}
          </div>
          <ListGroup>
            {tests.map((t: any, i: number) => (
              <UnitTestResultItem key={i} item={t} />
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};
