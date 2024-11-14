import React from 'react';
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  ForceResponsiveViewportFeature,
  ForceElementSizeFeature,
  useAutoheight,
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
  new ForceResponsiveViewportFeature({ maxScale: 1 }),
  new ForceElementSizeFeature({
    target: 'body',
    heightValue: '100vh',
    widthValue: '100%',
  })
);

export default function ResilientAutoheightWebView(props:any) {
  // useAutoheight에서 스타일 속성으로 minHeight를 지정
  const { autoheightWebshellProps } = useAutoheight({
    webshellProps: {
      ...props,
      style: [{ minHeight: 600 }, props.style], // 여기서 minHeight 스타일 추가
    },
  });

  return <Webshell {...autoheightWebshellProps} />;
}
