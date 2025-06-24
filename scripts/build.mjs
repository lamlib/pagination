import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['./src/main.js'],
  bundle: true,
  banner: {
    js: `
/*!
 * ============================================================
 *  Project:   pagination.js
 *  Version:   1.0.0
 *  Homepage:  https://github.com/lamlib/pagination
 *
 *  Description:
 *    Datasync giúp bạn xử lý bảng biểu trên client.
 *
 *  Author:    Nhat Han <lamlib2023@gmail.com>
 *  License:   MIT License
 *  Copyright: © 2025 Nhat Han
 *
 *  Created:   2025-06-24
 * ============================================================
 */`,
  },
  outfile: 'lib/pagination.iife.js',
  format: 'iife',
  globalName: 'Pagination',
  minify: true,
})