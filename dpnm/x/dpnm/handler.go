package dpnm

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/simsim/dpnm/x/dpnm/keeper"
	"github.com/simsim/dpnm/x/dpnm/types"
)

// NewHandler ...
func NewHandler(k keeper.Keeper) sdk.Handler {
	return func(ctx sdk.Context, msg sdk.Msg) (*sdk.Result, error) {
		ctx = ctx.WithEventManager(sdk.NewEventManager())

		switch msg := msg.(type) {
		// this line is used by starport scaffolding # 1
		case *types.MsgCreateCbdc:
			return handleMsgCreateCbdc(ctx, k, msg)

		case *types.MsgUpdateCbdc:
			return handleMsgUpdateCbdc(ctx, k, msg)

		case *types.MsgDeleteCbdc:
			return handleMsgDeleteCbdc(ctx, k, msg)

		default:
			errMsg := fmt.Sprintf("unrecognized %s message type: %T", types.ModuleName, msg)
			return nil, sdkerrors.Wrap(sdkerrors.ErrUnknownRequest, errMsg)
		}
	}
}
