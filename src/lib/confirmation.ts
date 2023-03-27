
export class Confirmation {

  chain: string;

  block_hash: number;

  block_height: number;

  block_index: number;

  timestamp: number;

  constructor({ chain, block_hash, block_height, block_index, timestamp }: any) {

    this.chain = chain

    this.block_hash = block_hash

    this.block_height = block_height

    this.block_index = block_index

    this.timestamp = timestamp

  }

}
