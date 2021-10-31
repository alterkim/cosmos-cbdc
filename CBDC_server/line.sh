#!/usr/bin


#echo "sender : ${1}, receiver : ${2}, token : ${3}"

simd tx bank send "$1" "$2" "$3" --keyring-backend test --chain-id sim --home ~/.simapp/simapp0 > /dev/null