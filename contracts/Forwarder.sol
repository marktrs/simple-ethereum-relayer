// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract Forwarder is MinimalForwarder {
    function batchExecute(
        ForwardRequest[] calldata requests,
        bytes[] calldata signatures
    ) public {
        for (uint i = 0; i < requests.length; i++) {
            super.execute(requests[i], signatures[i]);
        }
    }
}
