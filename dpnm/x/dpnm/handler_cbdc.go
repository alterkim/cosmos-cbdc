package dpnm

import (
	"fmt"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/simsim/dpnm/x/dpnm/keeper"
	"github.com/simsim/dpnm/x/dpnm/types"
)

func handleMsgCreateCbdc(ctx sdk.Context, k keeper.Keeper, msg *types.MsgCreateCbdc) (*sdk.Result, error) {
	k.CreateCbdc(ctx, *msg)

	return &sdk.Result{Events: ctx.EventManager().ABCIEvents()}, nil
}

func handleMsgUpdateCbdc(ctx sdk.Context, k keeper.Keeper, msg *types.MsgUpdateCbdc) (*sdk.Result, error) {
	var cbdc = types.Cbdc{
		Creator: msg.Creator,
		Id:      msg.Id,
	}

	// Checks that the element exists
	if !k.HasCbdc(ctx, msg.Id) {
		return nil, sdkerrors.Wrap(sdkerrors.ErrKeyNotFound, fmt.Sprintf("key %s doesn't exist", msg.Id))
	}

	// Checks if the the msg sender is the same as the current owner
	if msg.Creator != k.GetCbdcOwner(ctx, msg.Id) {
		return nil, sdkerrors.Wrap(sdkerrors.ErrUnauthorized, "incorrect owner")
	}

	k.SetCbdc(ctx, cbdc)

	return &sdk.Result{Events: ctx.EventManager().ABCIEvents()}, nil
}

func handleMsgDeleteCbdc(ctx sdk.Context, k keeper.Keeper, msg *types.MsgDeleteCbdc) (*sdk.Result, error) {
	if !k.HasCbdc(ctx, msg.Id) {
		return nil, sdkerrors.Wrap(sdkerrors.ErrKeyNotFound, fmt.Sprintf("key %s doesn't exist", msg.Id))
	}
	if msg.Creator != k.GetCbdcOwner(ctx, msg.Id) {
		return nil, sdkerrors.Wrap(sdkerrors.ErrUnauthorized, "incorrect owner")
	}

	k.DeleteCbdc(ctx, msg.Id)

	return &sdk.Result{Events: ctx.EventManager().ABCIEvents()}, nil
}
