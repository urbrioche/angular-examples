// import * as Highcharts from 'highcharts';
//
// export async function copyChartToClipboard(chart: Highcharts.Chart) {
//   const blob = await highChartToBlob(chart);
//   const data = [new ClipboardItem({[blob.type]: blob})];
//   await navigator.clipboard.write(data);
// }
//
// function highChartToBlob(chart: Highcharts.Chart & HighchartsExt) {
//   const exportingOptions = chart.options.exporting;
//   const noop = (e: any): void => {
//     console.error(e);
//   };
//   const dummy = {};
//   // use promise to make sure image onload event is fired.
//   return new Promise<Blob>((resolve, reject) => {
//     try {
//       chart.getSVGForLocalExport!(exportingOptions, dummy, noop, (svg: string) => {
//         const scale = exportingOptions?.scale || 2;
//         const imageType = 'image/png';
//         const svgUrl = URL.createObjectURL(new Blob([svg], {
//           type: 'image/svg+xml;charset-utf-16'
//         }));
//         const img = new Image();
//         img.addEventListener('load', function () {
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
//           canvas.height = img.height * scale;
//           canvas.width = img.width * scale;
//           ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
//           canvas.toBlob(blob => {
//             URL.revokeObjectURL(this.src);
//             resolve(blob!);
//           }, imageType);
//         });
//         img.src = svgUrl;
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// }
//
// interface HighchartsExt {
//   getSVGForLocalExport?: (
//     options?: Highcharts.ExportingOptions,
//     chartOptions?: Highcharts.Options,
//     failCallback?: (e: any) => void,
//     successCallback?: (data: string) => void) => void;
// }
/* eslint-disable jsdoc/require-jsdoc,@typescript-eslint/no-explicit-any */
import * as Highcharts from 'highcharts';

export function highChartToDataUrl(chart: Highcharts.Chart & HighchartsExt): Promise<string> {
  return highChartConverterCore<string>(chart, 'string');
}

export function highChartToBlob(chart: Highcharts.Chart & HighchartsExt): Promise<Blob> {
  return highChartConverterCore<Blob>(chart, 'blob');
}

export async function copyChartToClipboard(chart: Highcharts.Chart & HighchartsExt): Promise<void> {
  const blob = await highChartConverterCore<Blob>(chart, 'blob');
  const data = [new ClipboardItem({[blob.type]: blob})];
  await navigator.clipboard.write(data);
}

function highChartConverterCore<T extends string | Blob>(chart: Highcharts.Chart & HighchartsExt, mediaType: 'string' | 'blob') {
  const exportingOptions = chart.options.exporting;
  const noop = (e: any): void => {
    console.error('highChartConverterCore error:', e);
  };

  const options: Highcharts.Options = {};
  // use promise to make sure image onload event is fired.
  return new Promise<T>((resolve, reject) => {
    try {
      if (!chart.getSVGForLocalExport) {
        reject('the method "getSVGForLocalExport" not exist.');
      }

      if (mediaType !== 'string' && mediaType !== 'blob') {
        reject(`mediaType: ${mediaType as string} not supported.`);
      }

      chart.getSVGForLocalExport!(exportingOptions, options, noop, (svg) => {
        const scale = exportingOptions?.scale || 2;
        const imageType = 'image/png';
        const svgUrl = URL.createObjectURL(new Blob([svg], {
          type: 'image/svg+xml;charset-utf-16'
        }));
        const img = new Image();
        img.addEventListener('load', function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.height = img.height * scale;
          canvas.width = img.width * scale;
          console.log(canvas);
          ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(this.src);

          if (mediaType === 'blob') {
            canvas.toBlob(blob => {
              resolve(blob as T);
            }, imageType);
            return;
          }

          if (mediaType === 'string') {
            const dataURL = canvas.toDataURL(imageType);
            resolve(dataURL as T);
            return;
          }
        });
        img.src = svgUrl;
      });
    } catch (e) {
      reject(e);
    }
  });
}

interface HighchartsExt {
  getSVGForLocalExport?: (
    options?: Highcharts.ExportingOptions,
    chartOptions?: Highcharts.Options,
    failCallback?: (e: any) => void,
    successCallback?: (data: string) => void) => void;
}

