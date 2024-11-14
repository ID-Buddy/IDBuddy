import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  ForceResponsiveViewportFeature,
  ForceElementSizeFeature,
  useAutoheight
} from '@formidable-webview/webshell';

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
  new ForceResponsiveViewportFeature({ maxScale: 1 }),
  new ForceElementSizeFeature({
    target: 'body',
    heightValue: 'auto',
    widthValue: 'auto'
  })
);

export default function ResilientAutoheightWebView(props:any) {
  const { autoheightWebshellProps } = useAutoheight({
    webshellProps: props
  });
  return <Webshell {...autoheightWebshellProps} />;
}
