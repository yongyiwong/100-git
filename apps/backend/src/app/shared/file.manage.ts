export class FileManager {
  static createDirectory(directoryName: string) {
    const fs = require('fs');
    if (!fs.existsSync(directoryName, fs.constants.F_OK)) {
      const option = {
        mode: 0o777,
      }
      fs.mkdirSync(directoryName, option);
    }
  }
  static writeFileAsync(fileName: string, contents: string) {
    const fs = require('fs');
    let fd;
    try {
      fd = fs.openSync(fileName, 'w');
      if (fd) {
        fs.closeSync(fd);
      }
    } catch (error) {
      FileManager.createDirectory('streamtmp');
    } finally {
    }
    const fsPromises = require('fs/promises');
    const option = {
      mode: 0o777,
    }
    const data = new Uint8Array(Buffer.from(contents));
    return fsPromises.writeFile(fileName, data, option);
  }
  static writeFile( fileName:string, contents: string ) {
    const fs = require('fs');
    let fd;
    try {
      fd = fs.openSync(fileName, 'w');
      if (fd) {
        fs.closeSync(fd);
      }
    } catch (error) {
      FileManager.createDirectory('streamtmp');
    } finally {
    }
    const option = {
      mode: 0o777,
    }
    const data = new Uint8Array(Buffer.from(contents));
    return fs.writeFileSync(fileName, data, option);

  }
  static readFileASync(fileName: string) {
    const fsPromises = require('fs/promises');
    const fs = require('fs');
    let fd;
    try {
      fd = fs.openSync(fileName, 'r');
      if (fd) {
        fs.closeSync(fd);
        return fsPromises.readFile(fileName, 'utf8');
      }
    } catch (error) {
    } finally {
    }
    return null;
  }
  static readFile(fileName: string) {
    const fs = require('fs');
    let fd;
    try {
      fd = fs.openSync( fileName, 'r');
      if (fd) {
        fs.closeSync(fd);
        return fs.readFileSync(fileName, 'utf8');
      }
    } catch (error) {
    } finally {
    }
    return null;
  }
  static deleteFile(fileName: string ) {
    const fs = require('fs');    
    fs.unlink(fileName, (err) => {
      if (err) throw err;
      console.log( fileName + ' was deleted');
    });    
  }
}
