package keeper

import (
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/simsim/dpnm/x/dpnm/types"
	"strconv"
)

// GetCbdcCount get the total number of cbdc
func (k Keeper) GetCbdcCount(ctx sdk.Context) int64 {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcCountKey))
	byteKey := types.KeyPrefix(types.CbdcCountKey)
	bz := store.Get(byteKey)

	// Count doesn't exist: no element
	if bz == nil {
		return 0
	}

	// Parse bytes
	count, err := strconv.ParseInt(string(bz), 10, 64)
	if err != nil {
		// Panic because the count should be always formattable to int64
		panic("cannot decode count")
	}

	return count
}

// SetCbdcCount set the total number of cbdc
func (k Keeper) SetCbdcCount(ctx sdk.Context, count int64) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcCountKey))
	byteKey := types.KeyPrefix(types.CbdcCountKey)
	bz := []byte(strconv.FormatInt(count, 10))
	store.Set(byteKey, bz)
}

// CreateCbdc creates a cbdc with a new id and update the count
func (k Keeper) CreateCbdc(ctx sdk.Context, msg types.MsgCreateCbdc) {
	// Create the cbdc
	count := k.GetCbdcCount(ctx)
	var cbdc = types.Cbdc{
		Creator: msg.Creator,
		Id:      strconv.FormatInt(count, 10),
	}

	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcKey))
	key := types.KeyPrefix(types.CbdcKey + cbdc.Id)
	value := k.cdc.MustMarshalBinaryBare(&cbdc)
	store.Set(key, value)

	// Update cbdc count
	k.SetCbdcCount(ctx, count+1)
}

// SetCbdc set a specific cbdc in the store
func (k Keeper) SetCbdc(ctx sdk.Context, cbdc types.Cbdc) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcKey))
	b := k.cdc.MustMarshalBinaryBare(&cbdc)
	store.Set(types.KeyPrefix(types.CbdcKey+cbdc.Id), b)
}

// GetCbdc returns a cbdc from its id
func (k Keeper) GetCbdc(ctx sdk.Context, key string) types.Cbdc {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcKey))
	var cbdc types.Cbdc
	k.cdc.MustUnmarshalBinaryBare(store.Get(types.KeyPrefix(types.CbdcKey+key)), &cbdc)
	return cbdc
}

// HasCbdc checks if the cbdc exists
func (k Keeper) HasCbdc(ctx sdk.Context, id string) bool {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcKey))
	return store.Has(types.KeyPrefix(types.CbdcKey + id))
}

// GetCbdcOwner returns the creator of the cbdc
func (k Keeper) GetCbdcOwner(ctx sdk.Context, key string) string {
	return k.GetCbdc(ctx, key).Creator
}

// DeleteCbdc deletes a cbdc
func (k Keeper) DeleteCbdc(ctx sdk.Context, key string) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcKey))
	store.Delete(types.KeyPrefix(types.CbdcKey + key))
}

// GetAllCbdc returns all cbdc
func (k Keeper) GetAllCbdc(ctx sdk.Context) (msgs []types.Cbdc) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.CbdcKey))
	iterator := sdk.KVStorePrefixIterator(store, types.KeyPrefix(types.CbdcKey))

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var msg types.Cbdc
		k.cdc.MustUnmarshalBinaryBare(iterator.Value(), &msg)
		msgs = append(msgs, msg)
	}

	return
}
