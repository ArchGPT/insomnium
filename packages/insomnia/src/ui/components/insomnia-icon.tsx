import React from 'react';
import styled, { keyframes } from 'styled-components';

import { useAIContext } from '../context/app/ai-context';
/**** ><> ↑ --------- import statements */

const SlideInLeftKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const FadeInKeyframes = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;
/**** ><> ↑ --------- styling keyframes */

const Layout = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-xs)',
  paddingLeft: '11px',
  position: 'relative',
});

const RelativeFrame = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-xs)',
});

const AILoadingText = styled.div`
  display: flex;
  z-index: 1;
  align-items: center;
  height: 100%;
  font-size: var(--font-size-small);
  color: var(--color-font);
  padding-right: var(--padding-sm);
  opacity: 0;
  animation: ${FadeInKeyframes} 0.1s 0.3s ease-out forwards;
`;

const LoadingBoundary = styled.div({
  display: 'flex',
  width: 'calc(100% + 4px)',
  height: 'calc(100% + 2px)',
  position: 'absolute',
  overflow: 'hidden',
  borderRadius: '60px',
});

const LoadingBar = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 60px;
  opacity: 0;
  animation: ${SlideInLeftKeyframes} 0.4s ease-out forwards;
`;

const LoadingBarIndicator = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background-color: #7400e1;
  border-radius: 60px;
  opacity: 1;
  transform: translateX(-100%);
`;
/**** ><> ↑ --------- styled component definitions */

export const InsomniaLogo = ({
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  const {
    generating: loading,
    progress,
  } = useAIContext();

  const loadingProgress = 100 - (progress.progress / progress.total) * 100;

  return (
    <Layout>
      <RelativeFrame>
        <div>
          &nbsp;
        </div>
        {loading && <LoadingBoundary>
          <LoadingBar />
          <LoadingBarIndicator
            style={{
              opacity: progress.progress === 0 || progress.total === progress.progress ? 0 : 1,
              transform: `translateX(-${loadingProgress}%)`,
            }}
          />
        </LoadingBoundary>
        }
      </RelativeFrame>
    </Layout>
  );
};
/**** ><> ↑ --------- functional component definition */
