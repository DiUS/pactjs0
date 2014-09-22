module.exports = function (path) {
    var instrumentedDir = process.env.APP_DIR_FOR_CODE_COVERAGE;
    var srcDir = instrumentedDir || 'src';
    srcDir = "../" + srcDir + "/";
    return require(srcDir + path);
};
