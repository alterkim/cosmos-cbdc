#!/usr/bin


#echo "sender : ${1}, receiver : ${2}, token : ${3}"

dpnmd tx bank send "$1" "$2" "$3" > /dev/null #&& echo "CBDC.sh called finished!" 


dpnmd query bank balances "$1" |grep "amount:"

#https://docs.cosmos.network/master/run-node/run-node.html 참고
#sender : "cosmos1qwf9gvqh538rnjmtnq4xmaxmm74yjv9wd8htjt", receiver:"cosmos1qz49l8dc3ay5aun2hkndld962scnhg8adj3qa7", amount:amount, token:tokenName