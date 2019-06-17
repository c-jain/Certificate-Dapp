pragma solidity >=0.5.0 <0.6.0;
import "openzeppelin-eth/contracts/token/ERC721/ERC721Full.sol";
import "zos-lib/contracts/Initializable.sol";

contract CertificateToken is Initializable, ERC721Full {

	uint public index;

	function initialize() initializer public {
		ERC721Metadata.initialize("Certificate Token", "CFT");
		index = 0;
    }
	
	struct Certificate {
		bytes32 courseName;
		bytes32 courseDescription;
		bytes32 date;
		bytes32 organizationName;
		address creator;
	}

	mapping(bytes32 => Certificate) userCertificates;
	

	function createCertificate(bytes32 _courseName, bytes32 _courseDescription, bytes32 _date,
	                           bytes32 _organizationName, bytes32 issue, string memory _tokenURI) public returns (uint) {
		bytes32 hash = keccak256(abi.encodePacked(_courseName, _courseDescription, _date, _organizationName, issue, msg.sender));
		require(userCertificates[hash].creator == address(0));
		userCertificates[hash] = Certificate(_courseName, _courseDescription, _date, _organizationName, msg.sender);
		index += 1;
		_mint(msg.sender, index);
		_setTokenURI(index, _tokenURI);
		return index;
	}	
}