const CryptoJS = require("crypto-js");

const PEM = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAryQICCl6NZ5gDKrnSztO
3Hy8PEUcuyvg/ikC+VcIo2SFFSf18a3IMYldIugqqqZCs4/4uVW3sbdLs/6PfgdX
7O9D22ZiFWHPYA2k2N744MNiCD1UE+tJyllUhSblK48bn+v1oZHCM0nYQ2NqUkvS
j+hwUU3RiWl7x3D2s9wSdNt7XUtW05a/FXehsPSiJfKvHJJnGOX0BgTvkLnkAOTd
OrUZ/wK69Dzu4IvrN4vs9Nes8vbwPa/ddZEzGR0cQMt0JBkhk9kU/qwqUseP1QRJ
5I1jR4g8aYPL/ke9K35PxZWuDp3U0UPAZ3PjFAh+5T+fc7gzCs9dPzSHloruU+gl
FQIDAQAB
-----END PUBLIC KEY-----
`;

var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

var pri = "/home/rudder/noweek/prikey.pem"
var pub = "/home/rudder/noweek/pubkey.pem"

var encryptStringWithRsaPrivateKey = function(toEncrypt, relativeOrAbsolutePathToPrivateKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathToPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.privateEncrypt(privateKey, buffer);
    return encrypted.toString("base64");
};

var decryptStringWithRsaPublicKey = function(toDecrypt, relativeOrAbsolutePathToPublicKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toDecrypt, "base64");
    var decrypted = crypto.publicDecrypt(publicKey, buffer);
    return decrypted.toString("utf8");
};

class Block{
    constructor(index, timestamp, previousHash, pubkey, hash, signature){
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.pubkey = pubkey;
        this.hash = hash;
        this.signature = signature;
    }
}

const createHash = (index, timestamp, previousHash, pubkey) =>
  CryptoJS.SHA256(
    index + timestamp + previousHash + pubkey
).toString();

const getBlocksHash = block =>
  createHash(
    block.index,
    block.timestamp,
    block.previousHash,
    block.pubkey
    );

const getSignature = hash => encryptStringWithRsaPrivateKey(hash, pri);

const setBlock = (index, timestamp, previousHash, pubkey, signingKey) => new Block(
    index,
    timestamp,
    previousHash,
    pubkey,
    createHash(index, timestamp, previousHash, pubkey),
    getSignature(createHash(index, timestamp, previousHash, pubkey), signingKey)
);

const genesisBlock = setBlock(0, 1518512316, PEM, "");

/// 
var fsAccess = require('fs-access');

const __BLOCKCHAIN_DIR__ = 'blocks';
const __BLOCKCHAIN_POSTFIX__ = '.blk';
var BLOCKCHAIN = [];

// check block directory
fsAccess(__BLOCKCHAIN_DIR__, function (err) {
    // if not exist file
    if (err) {
        console.error(__BLOCKCHAIN_DIR__ + "not exist");
        fs.mkdir(__BLOCKCHAIN_DIR__, 0775, function(err){
                if(err){
                        console.log("Create " + __BLOCKCHAIN_DIR__ + " directory fail");
                        return false;
                }
                console.log("Create " + __BLOCKCHAIN_DIR__ + " directory success");
        });
        return;
    }
    // exist file
});

function get_last_block_number() {
    var files = fs.readdirSync(__BLOCKCHAIN_DIR__);
    var blockList = [];
    if (files.length == 0)
        return 0;
    for (var i in files) {
        blockList.push(Number(files[i].split(__BLOCKCHAIN_POSTFIX__)[0]))
    }
    blockList.sort(function(a,b) {
        return a - b;
    })
    return blockList[blockList.length-1];
}

function get_file_list() {
    var files = fs.readdirSync(__BLOCKCHAIN_DIR__);
    var blockList = [];
    if (files.length == 0)
        return 0;
    for (var i in files) {
        blockList.push(Number(files[i].split(__BLOCKCHAIN_POSTFIX__)[0]))
    }
    blockList.sort(function(a,b) {
        return a - b;
    })
    return blockList;
}

function block_file2mem(block_idx){
    file_name = __BLOCKCHAIN_DIR__ + '/' + block_idx + __BLOCKCHAIN_POSTFIX__;
    buffer = fs.readFileSync(file_name);

    block = JSON.parse(buffer);
    return Object.assign(new Block, block);
}

function block_mem2file(block_idx, block){
    file_name = __BLOCKCHAIN_DIR__ + '/' + block_idx + __BLOCKCHAIN_POSTFIX__;
    block_json = JSON.stringify(block, null, 4);
    console.log(block_json)

    fs.writeFileSync(file_name, block_json);

    // fs.writeFile(file_name, block_json, function(err){
    //     if(err){
    //             console.log("(*** Sync " + file_name + " Block fail");
    //             return false;
    //     }
    //     console.log("*** Sync " + file_name + " Block success");
    // });

    return true;
}

///
const blockchain_run = () => {
    // 내 로컬에 있는 블록 정보 로딩, 동기화
    fileList = get_file_list();
    for(var idx in fileList){
        console.log("blockchain_run: " + idx);
        console.log(block_file2mem(idx));
    }
}

const blockchain_init = (pubkeyPath, signingKey) => {
    if (BLOCKCHAIN.length !== 0) return;

    pubkey = fs.readFileSync(pubkeyPath).toString();
    timestamp = new Date().getTime().toString();

    newBlock = setBlock(0, timestamp, "", pubkey, signingKey);   
    BLOCKCHAIN.push(newBlock);
    block_mem2file(0, newBlock);

    //request: blockchain_getList
};

const blockchain_add = (pubkeyPath, signingKey) => {
    pubkey = fs.readFileSync(pubkeyPath).toString();
    previousIndex = BLOCKCHAIN.length - 1;
    previousBlock = BLOCKCHAIN[previousIndex];
    timestamp = new Date().getTime().toString();
    
    newBlock = setBlock(previousIndex+1, timestamp, previousBlock.hash, pubkey, signingKey);
    BLOCKCHAIN.push(newBlock);
    block_mem2file(previousIndex+1, newBlock);

    //broadcast
};

const blockchain_getList = () => {
    console.log("===blockchain_getList===");
    console.log(BLOCKCHAIN);
};

console.log(genesisBlock);

console.log("");
console.log("hash: " + genesisBlock.hash);
console.log("encryption: " + genesisBlock.signature);
console.log("decryption: " + decryptStringWithRsaPublicKey(genesisBlock.signature, pub));

blockchain_init(pub, pri);
blockchain_add(pub, pri);
blockchain_add(pub, pri);
blockchain_getList();
blockchain_run();


/***
 * . Blockchain get 할 때, 어떤 방식으로 공유할지
 * . 적혀있는 블록+index 읽어서 메모리에 로드
 * . broadcast
 * . AWS 연동테스트
 */