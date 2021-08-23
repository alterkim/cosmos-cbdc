package cli

import (
	"context"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/simsim/dpnm/x/dpnm/types"
	"github.com/spf13/cobra"
)

func CmdListCbdc() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-cbdc",
		Short: "list all cbdc",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllCbdcRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.CbdcAll(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}

func CmdShowCbdc() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-cbdc [id]",
		Short: "shows a cbdc",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryGetCbdcRequest{
				Id: args[0],
			}

			res, err := queryClient.Cbdc(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
