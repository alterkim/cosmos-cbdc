package keeper

import (
	"context"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/simsim/dpnm/x/dpnm/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) CbdcAll(c context.Context, req *types.QueryAllCbdcRequest) (*types.QueryAllCbdcResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var cbdcs []*types.Cbdc
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	cbdcStore := prefix.NewStore(store, types.KeyPrefix(types.CbdcKey))

	pageRes, err := query.Paginate(cbdcStore, req.Pagination, func(key []byte, value []byte) error {
		var cbdc types.Cbdc
		if err := k.cdc.UnmarshalBinaryBare(value, &cbdc); err != nil {
			return err
		}

		cbdcs = append(cbdcs, &cbdc)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllCbdcResponse{Cbdc: cbdcs, Pagination: pageRes}, nil
}

func (k Keeper) Cbdc(c context.Context, req *types.QueryGetCbdcRequest) (*types.QueryGetCbdcResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var cbdc types.Cbdc
	ctx := sdk.UnwrapSDKContext(c)

	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcKey))
	k.cdc.MustUnmarshalBinaryBare(store.Get(types.KeyPrefix(types.CbdcKey+req.Id)), &cbdc)

	return &types.QueryGetCbdcResponse{Cbdc: &cbdc}, nil
}
